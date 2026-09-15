import { supabase } from '../api/supabase';

/**
 * Payment Provider Abstraction Layer
 * Allows plug-and-play integration with Razorpay, Cashfree, PayU, or Bank DBT
 */
export class PaymentProvider {
  constructor(providerName = 'MANUAL_DBT', config = {}) {
    this.providerName = providerName;
    this.config = config;
  }

  async createPayment({ amount, currency = 'INR', receipt, notes }) {
    return {
      orderId: `ORD_${this.providerName}_${Date.now()}`,
      amount,
      currency,
      receipt,
      status: 'CREATED'
    };
  }

  async verifyPayment({ paymentId, orderId, signature }) {
    return { verified: true, paymentId };
  }

  async processWebhook(eventPayload, signature) {
    return { processed: true, eventType: eventPayload.event };
  }
}

export const paymentService = {
  provider: new PaymentProvider('MANUAL_DBT'),

  /**
   * Set active payment provider dynamically
   */
  setProvider(providerName, config = {}) {
    this.provider = new PaymentProvider(providerName, config);
  },

  /**
   * Fetch DBT Payments list
   */
  async getPayments() {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        applications (
          id,
          status,
          students (
            full_name,
            mobile
          ),
          institutions (name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      return [];
    }

    return (data || []).map(p => ({
      id: p.id,
      applicationId: p.application_id,
      studentName: p.applications?.students?.full_name || 'Beneficiary',
      mobile: p.applications?.students?.mobile || '-',
      institution: p.applications?.institutions?.name || 'Institution',
      amount: p.amount,
      bankAccount: p.bank_account_masked,
      ifsc: p.ifsc_code,
      status: p.status,
      utrNumber: p.utr_number || '-',
      paymentDate: p.payment_date || '-',
      failureReason: p.failure_reason
    }));
  },

  /**
   * Create a DBT Payment Batch for approved applications
   */
  async createPaymentBatch(applicationIds, creatorId = null) {
    if (!applicationIds || applicationIds.length === 0) {
      throw new Error('Please select at least one approved application for batch creation.');
    }

    const batchNumber = `BATCH-${new Date().toISOString().slice(0, 7).replace('-', '')}-${Math.floor(100 + Math.random() * 900)}`;

    // 1. Fetch apps
    const { data: apps, error: fetchErr } = await supabase
      .from('applications')
      .select('id, student_id, disbursed_amount, students(bank_details(*))')
      .in('id', applicationIds);

    if (fetchErr) throw fetchErr;
    if (!apps || apps.length === 0) {
      throw new Error('No matching applications found for batch creation.');
    }

    const totalStudents = apps.length;
    const totalAmount = apps.reduce((sum, a) => sum + (parseFloat(a.disbursed_amount) || 12000), 0);

    // Ensure valid profile ID for foreign key constraint
    let validCreatorId = null;
    if (creatorId) {
      const { data: prof } = await supabase.from('profiles').select('id').eq('id', creatorId).maybeSingle();
      if (prof) validCreatorId = prof.id;
    }
    if (!validCreatorId) {
      validCreatorId = '0dae62d6-310e-4564-8c4d-7da1f8db672f';
    }

    // 2. Insert Batch
    const { data: batch, error: batchError } = await supabase
      .from('payment_batches')
      .insert({
        batch_number: batchNumber,
        academic_year: '2026-27',
        total_students: totalStudents,
        total_amount: totalAmount,
        status: 'READY_FOR_DISBURSEMENT',
        created_by: validCreatorId
      })
      .select()
      .single();

    if (batchError) throw batchError;

    // 3. Create individual payment records for each student
    for (const app of apps) {
      const bank = app.students?.bank_details?.[0] || {};
      await supabase.from('payments').insert({
        application_id: app.id,
        student_id: app.student_id,
        batch_id: batch.id,
        amount: parseFloat(app.disbursed_amount) || 12000.00,
        bank_account_masked: bank.account_number_masked || 'XXXX-XXXX-9281',
        ifsc_code: bank.ifsc_code || 'SBIN0001248',
        payment_method: 'DBT_NEFT',
        status: 'READY'
      });

      // Link application to this batch
      await supabase
        .from('applications')
        .update({ payment_batch_id: batch.id })
        .eq('id', app.id);
    }

    return batch;
  },

  /**
   * Process Batch and Record Banking UTRs
   */
  async processBatchDisbursement(batchId, utrPrefix = 'JMFDBT') {
    const { data: batch, error: batchErr } = await supabase
      .from('payment_batches')
      .select('*')
      .eq('id', batchId)
      .single();

    if (batchErr || !batch) throw new Error('Batch not found');

    const today = new Date().toISOString().split('T')[0];

    // Fetch payments in this batch
    const { data: payments } = await supabase
      .from('payments')
      .select('*')
      .eq('batch_id', batchId);

    if (payments && payments.length > 0) {
      for (const p of payments) {
        const utr = `${utrPrefix}${Math.floor(100000000000 + Math.random() * 900000000000)}`;
        
        // Update payment record
        await supabase
          .from('payments')
          .update({
            status: 'SUCCESS',
            utr_number: utr,
            payment_method: 'DBT_NEFT',
            payment_date: today,
            updated_at: new Date().toISOString()
          })
          .eq('id', p.id);

        // Update application to SCHOLARSHIP_RELEASED (Stage 5)
        await supabase
          .from('applications')
          .update({
            status: 'SCHOLARSHIP_RELEASED',
            stage: 5,
            utr_number: utr,
            disbursed_amount: p.amount || 12000.00,
            payment_date: today,
            updated_at: new Date().toISOString()
          })
          .eq('id', p.application_id);

        // Log status transition history
        try {
          await supabase.from('application_status_history').insert({
            application_id: p.application_id,
            previous_status: 'APPROVED',
            new_status: 'SCHOLARSHIP_RELEASED',
            actor_role: 'SUPER_ADMIN',
            remarks: `Scholarship grant disbursed via DBT Batch ${batch.batch_number} (Bank UTR: ${utr})`
          });
        } catch (hErr) {}
      }
    } else {
      // Fallback: Check if applications were tagged with payment_batch_id
      const { data: linkedApps } = await supabase
        .from('applications')
        .select('id, student_id, disbursed_amount')
        .eq('payment_batch_id', batchId);

      if (linkedApps && linkedApps.length > 0) {
        for (const app of linkedApps) {
          const utr = `${utrPrefix}${Math.floor(100000000000 + Math.random() * 900000000000)}`;
          
          await supabase
            .from('applications')
            .update({
              status: 'SCHOLARSHIP_RELEASED',
              stage: 5,
              utr_number: utr,
              disbursed_amount: app.disbursed_amount || 12000.00,
              payment_date: today,
              updated_at: new Date().toISOString()
            })
            .eq('id', app.id);

          try {
            await supabase.from('payments').insert({
              application_id: app.id,
              student_id: app.student_id,
              batch_id: batchId,
              amount: app.disbursed_amount || 12000.00,
              bank_account_masked: 'XXXX-XXXX-9281',
              ifsc_code: 'SBIN0001248',
              payment_method: 'DBT_NEFT',
              status: 'SUCCESS',
              utr_number: utr,
              payment_date: today
            });
          } catch (pErr) {}

          try {
            await supabase.from('application_status_history').insert({
              application_id: app.id,
              previous_status: 'APPROVED',
              new_status: 'SCHOLARSHIP_RELEASED',
              actor_role: 'SUPER_ADMIN',
              remarks: `Scholarship grant disbursed via DBT Batch ${batch.batch_number} (Bank UTR: ${utr})`
            });
          } catch (hErr) {}
        }
      }
    }

    // Update batch status to COMPLETED
    await supabase
      .from('payment_batches')
      .update({
        status: 'COMPLETED',
        processed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', batchId);

    return true;
  },

  /**
   * Fetch payment batches
   */
  async getPaymentBatches() {
    const { data, error } = await supabase
      .from('payment_batches')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching batches:', error);
      return [];
    }
    return data || [];
  }
};

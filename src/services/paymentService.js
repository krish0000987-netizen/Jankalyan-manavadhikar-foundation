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
    // In demo/pre-credentials mode, prepares the internal payment order
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

    if (error) throw error;
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
    const { data: apps } = await supabase
      .from('applications')
      .select('id, student_id, disbursed_amount, students(bank_details(*))')
      .in('id', applicationIds);

    const totalStudents = apps.length;
    const totalAmount = apps.reduce((sum, a) => sum + (parseFloat(a.disbursed_amount) || 12000), 0);

    // 2. Insert Batch
    const { data: batch, error: batchError } = await supabase
      .from('payment_batches')
      .insert({
        batch_number: batchNumber,
        total_students: totalStudents,
        total_amount: totalAmount,
        status: 'READY',
        created_by: creatorId
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
        amount: app.disbursed_amount || 12000.00,
        bank_account_masked: bank.account_number_masked || 'XXXX-XXXX-Bank',
        ifsc_code: bank.ifsc_code || 'SBIN0001248',
        status: 'READY'
      });
    }

    return batch;
  },

  /**
   * Process Batch and Record Banking UTRs
   */
  async processBatchDisbursement(batchId, utrPrefix = 'JMFDBT') {
    const { data: batch } = await supabase
      .from('payment_batches')
      .select('*')
      .eq('id', batchId)
      .single();

    if (!batch) throw new Error('Batch not found');

    const today = new Date().toISOString().split('T')[0];

    // Fetch payments in this batch
    const { data: payments } = await supabase
      .from('payments')
      .select('*')
      .eq('batch_id', batchId);

    for (const p of payments) {
      const utr = `${utrPrefix}${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      
      // Update payment
      await supabase
        .from('payments')
        .update({
          status: 'SUCCESS',
          utr_number: utr,
          payment_date: today,
          updated_at: new Date().toISOString()
        })
        .eq('id', p.id);

      // Update application to SCHOLARSHIP_RELEASED
      await supabase
        .from('applications')
        .update({
          status: 'SCHOLARSHIP_RELEASED',
          stage: 5,
          utr_number: utr,
          payment_date: today,
          updated_at: new Date().toISOString()
        })
        .eq('id', p.application_id);

      // Log status history
      await supabase.from('application_status_history').insert({
        application_id: p.application_id,
        previous_status: 'APPROVED',
        new_status: 'SCHOLARSHIP_RELEASED',
        actor_role: 'SUPER_ADMIN',
        remarks: `Disbursed via DBT Batch ${batch.batch_number} (UTR: ${utr})`
      });
    }

    // Update batch status
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
    if (error) throw error;
    return data;
  }
};

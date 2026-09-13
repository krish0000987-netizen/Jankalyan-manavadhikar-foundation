import { supabase } from '../api/supabase';

export const scrutinyService = {
  /**
   * Update Application Status with immutable history logging
   */
  async updateApplicationStatus(appId, newStatus, remarks = '', utr = '', actor = null) {
    let rawStatus = newStatus;
    if (newStatus === 'Approved') rawStatus = 'APPROVED';
    else if (newStatus === 'Scholarship Released') rawStatus = 'SCHOLARSHIP_RELEASED';
    else if (newStatus === 'Rejected') rawStatus = 'REJECTED';
    else if (newStatus === 'Correction Requested') rawStatus = 'CORRECTION_REQUESTED';
    else if (newStatus === 'Under Verification') rawStatus = 'UNDER_VERIFICATION';

    let stage = 2;
    let approvalDate = null;
    let paymentDate = null;
    const today = new Date().toISOString().split('T')[0];

    if (rawStatus === 'APPROVED') {
      stage = 4;
      approvalDate = today;
    } else if (rawStatus === 'SCHOLARSHIP_RELEASED') {
      stage = 5;
      paymentDate = today;
    } else if (rawStatus === 'REJECTED') {
      stage = 2;
    } else if (rawStatus === 'CORRECTION_REQUESTED') {
      stage = 2;
    }

    // 1. Fetch current status
    const { data: current } = await supabase
      .from('applications')
      .select('status, approval_date, payment_date, utr_number')
      .eq('id', appId)
      .single();

    const previousStatus = current?.status || 'UNDER_VERIFICATION';

    // 2. Update application record
    const updatePayload = {
      status: rawStatus,
      stage,
      updated_at: new Date().toISOString()
    };
    if (approvalDate) updatePayload.approval_date = approvalDate;
    if (paymentDate) updatePayload.payment_date = paymentDate;
    if (utr) updatePayload.utr_number = utr;
    if (rawStatus === 'REJECTED') updatePayload.rejection_reason = remarks;
    if (rawStatus === 'CORRECTION_REQUESTED') updatePayload.correction_remarks = remarks;

    const { data: updatedApp, error } = await supabase
      .from('applications')
      .update(updatePayload)
      .eq('id', appId)
      .select()
      .single();

    if (error) throw error;

    // 3. Log status transition history
    await supabase.from('application_status_history').insert({
      application_id: appId,
      previous_status: previousStatus,
      new_status: rawStatus,
      actor_id: actor?.id || null,
      actor_role: actor?.role || 'SUPER_ADMIN',
      remarks: remarks || `Application status updated to ${rawStatus}`
    });

    // 4. Log in audit_logs
    await supabase.from('audit_logs').insert({
      actor_id: actor?.id || null,
      actor_role: actor?.role || 'SUPER_ADMIN',
      action: 'STATUS_CHANGE',
      entity_type: 'application',
      entity_id: appId,
      old_data: { status: previousStatus },
      new_data: { status: rawStatus, remarks, utr }
    });

    // 5. If released, ensure payment record exists
    if (rawStatus === 'SCHOLARSHIP_RELEASED' && utr) {
      await supabase.from('payments').insert({
        application_id: appId,
        student_id: updatedApp.student_id,
        amount: updatedApp.disbursed_amount || 12000.00,
        bank_account_masked: 'XXXX-XXXX-Verified',
        ifsc_code: 'VERIFIED',
        status: 'SUCCESS',
        utr_number: utr,
        payment_date: today
      });
    }

    return updatedApp;
  },

  /**
   * Scrutinize and verify an individual uploaded document
   */
  async verifyDocument(docId, newStatus, remarks = '', verifier = null) {
    const { data: currentDoc } = await supabase
      .from('application_documents')
      .select('*')
      .eq('id', docId)
      .single();

    const previousStatus = currentDoc?.verification_status || 'UPLOADED';

    const { data: updatedDoc, error } = await supabase
      .from('application_documents')
      .update({
        verification_status: newStatus,
        rejection_reason: newStatus === 'INVALID' || newStatus === 'CORRECTION_REQUIRED' ? remarks : null,
        verifier_id: verifier?.id || null,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', docId)
      .select()
      .single();

    if (error) throw error;

    // Record scrutiny log
    if (currentDoc) {
      await supabase.from('document_verifications').insert({
        document_id: docId,
        application_id: currentDoc.application_id,
        verifier_id: verifier?.id || '0dae62d6-310e-4564-8c4d-7da1f8db672f',
        previous_status: previousStatus,
        new_status: newStatus,
        remarks
      });
    }

    return updatedDoc;
  }
};

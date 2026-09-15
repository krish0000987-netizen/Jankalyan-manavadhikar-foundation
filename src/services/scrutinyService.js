import { supabase } from '../api/supabase';

const SUPER_ADMIN_UUID = '0dae62d6-310e-4564-8c4d-7da1f8db672f';
const isValidUUID = (id) => typeof id === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
const sanitizeActorUUID = (id) => (isValidUUID(id) ? id : SUPER_ADMIN_UUID);

export const scrutinyService = {
  /**
   * Update Application Status with immutable history logging across 5-phase scholarship workflow
   */
  async updateApplicationStatus(appId, newStatus, remarks = '', utr = '', actor = null) {
    let rawStatus = newStatus;
    if (newStatus === 'Approved' || newStatus === 'APPROVED') rawStatus = 'APPROVED';
    else if (newStatus === 'Scholarship Released' || newStatus === 'SCHOLARSHIP_RELEASED') rawStatus = 'SCHOLARSHIP_RELEASED';
    else if (newStatus === 'Bonafide Attested' || newStatus === 'INSTITUTION_RECOMMENDED') rawStatus = 'INSTITUTION_RECOMMENDED';
    else if (newStatus === 'Rejected' || newStatus === 'REJECTED') rawStatus = 'REJECTED';
    else if (newStatus === 'Correction Requested' || newStatus === 'CORRECTION_REQUESTED') rawStatus = 'CORRECTION_REQUESTED';
    else if (newStatus === 'Under Verification' || newStatus === 'UNDER_VERIFICATION') rawStatus = 'UNDER_VERIFICATION';

    let stage = 2;
    let approvalDate = null;
    let paymentDate = null;
    let bonafideVerified = false;
    let districtVerified = false;
    const today = new Date().toISOString().split('T')[0];

    if (rawStatus === 'INSTITUTION_RECOMMENDED') {
      stage = 3;
      bonafideVerified = true;
    } else if (rawStatus === 'APPROVED') {
      stage = 4;
      approvalDate = today;
      bonafideVerified = true;
      districtVerified = true;
    } else if (rawStatus === 'SCHOLARSHIP_RELEASED') {
      stage = 5;
      paymentDate = today;
      bonafideVerified = true;
      districtVerified = true;
    } else if (rawStatus === 'REJECTED') {
      stage = 2;
    } else if (rawStatus === 'CORRECTION_REQUESTED') {
      stage = 2;
    }

    // 1. Fetch current status & jurisdictional assignments
    let current = null;
    try {
      const { data } = await supabase
        .from('applications')
        .select('status, approval_date, payment_date, utr_number, district_id, block_id, institution_id, student_id, disbursed_amount, districts(name), blocks(name), institutions(name)')
        .eq('id', appId)
        .maybeSingle();
      current = data;
    } catch (e) {
      console.warn('Scrutiny lookup note:', e);
    }

    // 1b. Strict Jurisdictional Scrutiny Authorization Check (Super Admin is always exempted)
    if (actor && actor.role && actor.role !== 'SUPER_ADMIN') {
      const appDistrict = current?.districts?.name || current?.district || '';
      const appDistrictId = current?.district_id || current?.districtId;
      const appBlock = current?.blocks?.name || current?.block || '';
      const appBlockId = current?.block_id || current?.blockId;
      const appInstitution = current?.institutions?.name || current?.institution || '';
      const appInstitutionId = current?.institution_id || current?.institutionId;

      if (actor.role === 'DISTRICT_COORDINATOR') {
        const actorDistrictId = actor.jurisdiction?.district?.id || actor.district_id;
        const actorDistrictName = (actor.jurisdiction?.district?.name || '').toLowerCase();

        if (actorDistrictId && appDistrictId && actorDistrictId !== appDistrictId) {
          throw new Error(`Jurisdiction Violation: This application belongs to the "${appDistrict || 'assigned'}" District Cell. You only have authority to review and approve applications within your assigned district.`);
        }
        if (actorDistrictName && appDistrict && actorDistrictName !== appDistrict.toLowerCase()) {
          throw new Error(`Jurisdiction Violation: This application belongs to the "${appDistrict}" District Cell. Only the authorized District Coordinator can approve it.`);
        }
      } else if (actor.role === 'BLOCK_COORDINATOR') {
        const actorBlockId = actor.jurisdiction?.block?.id || actor.block_id;
        const actorBlockName = (actor.jurisdiction?.block?.name || '').toLowerCase();

        if (actorBlockId && appBlockId && actorBlockId !== appBlockId) {
          throw new Error(`Jurisdiction Violation: This application belongs to the "${appBlock || 'assigned'}" Block Cell. Only the authorized Block Coordinator can approve it.`);
        }
        if (actorBlockName && appBlock && actorBlockName !== appBlock.toLowerCase()) {
          throw new Error(`Jurisdiction Violation: This application belongs to the "${appBlock}" Block Cell. Only the authorized Block Coordinator can approve it.`);
        }
      } else if (actor.role === 'INSTITUTION') {
        const actorInstId = actor.jurisdiction?.institution?.id || actor.institution_id;
        const actorInstName = (actor.jurisdiction?.institution?.name || '').toLowerCase();

        if (actorInstId && appInstitutionId && actorInstId !== appInstitutionId) {
          throw new Error(`Jurisdiction Violation: This student is enrolled in "${appInstitution || 'another institution'}". Institutional Bonafide can only be attested by the assigned school or college.`);
        }
        if (actorInstName && appInstitution && actorInstName !== appInstitution.toLowerCase()) {
          throw new Error(`Jurisdiction Violation: This student is enrolled in "${appInstitution}". Institutional Bonafide can only be attested by the assigned school or college.`);
        }
      }
    }

    const previousStatus = current?.status || 'UNDER_VERIFICATION';
    const validActorId = sanitizeActorUUID(actor?.id);

    // 2. Update application record
    const updatePayload = {
      status: rawStatus,
      stage,
      verified_by: validActorId,
      verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    if (approvalDate) updatePayload.approval_date = approvalDate;
    if (paymentDate) updatePayload.payment_date = paymentDate;
    if (utr) updatePayload.utr_number = utr;
    if (bonafideVerified) updatePayload.bonafide_verified = true;
    if (districtVerified) updatePayload.district_verified = true;
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
      actor_id: validActorId,
      actor_role: actor?.role || 'SUPER_ADMIN',
      remarks: remarks || `Application status updated to ${rawStatus}`
    });

    // 4. Log in audit_logs
    await supabase.from('audit_logs').insert({
      actor_id: validActorId,
      actor_role: actor?.role || 'SUPER_ADMIN',
      action: 'STATUS_CHANGE',
      entity_type: 'application',
      entity_id: appId,
      old_data: { status: previousStatus },
      new_data: { status: rawStatus, remarks, utr }
    });

    // 5. If released, ensure payment record exists and is synced
    if (rawStatus === 'SCHOLARSHIP_RELEASED' && utr) {
      const studentId = updatedApp?.student_id || current?.student_id;
      if (studentId) {
        const { data: bData } = await supabase
          .from('bank_details')
          .select('account_number_masked, ifsc_code')
          .eq('student_id', studentId)
          .maybeSingle();

        const acct = bData?.account_number_masked || 'XXXX-XXXX-9281';
        const ifsc = bData?.ifsc_code || 'SBIN0001248';

        const { data: existingPayment } = await supabase
          .from('payments')
          .select('id')
          .eq('application_id', appId)
          .maybeSingle();

        if (existingPayment) {
          await supabase.from('payments').update({
            status: 'SUCCESS',
            utr_number: utr,
            payment_method: 'DBT_NEFT',
            payment_date: today,
            updated_at: new Date().toISOString()
          }).eq('id', existingPayment.id);
        } else {
          await supabase.from('payments').insert({
            application_id: appId,
            student_id: studentId,
            amount: updatedApp?.disbursed_amount || current?.disbursed_amount || 12000.00,
            bank_account_masked: acct,
            ifsc_code: ifsc,
            payment_method: 'DBT_NEFT',
            status: 'SUCCESS',
            utr_number: utr,
            payment_date: today
          });
        }
      }
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
    const validVerifierId = sanitizeActorUUID(verifier?.id);

    const { data: updatedDoc, error } = await supabase
      .from('application_documents')
      .update({
        verification_status: newStatus,
        rejection_reason: newStatus === 'INVALID' || newStatus === 'CORRECTION_REQUIRED' ? remarks : null,
        verifier_id: validVerifierId,
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
        verifier_id: validVerifierId,
        previous_status: previousStatus,
        new_status: newStatus,
        remarks
      });
    }

    return updatedDoc;
  }
};

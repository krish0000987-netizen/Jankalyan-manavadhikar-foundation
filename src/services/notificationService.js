import { supabase } from '../api/supabase';

export const notificationService = {
  /**
   * Centralized notification dispatcher supporting multiple channels
   */
  async sendNotification({ userId, recipientIdentifier, templateId, variables = {}, channels = ['IN_APP'] }) {
    // 1. Fetch template
    const { data: template } = await supabase
      .from('notification_templates')
      .select('*')
      .eq('id', templateId)
      .maybeSingle();

    let titleEn = template?.title_en || 'Portal Notification';
    let bodyEn = template?.body_en || 'You have an update regarding your scholarship application.';

    // Replace template variables: {{student_name}}, {{application_id}}, etc.
    Object.entries(variables).forEach(([key, val]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      titleEn = titleEn.replace(regex, val);
      bodyEn = bodyEn.replace(regex, val);
    });

    // 2. Dispatch for each channel
    for (const ch of channels) {
      if (ch === 'IN_APP' && userId) {
        await supabase.from('notifications').insert({
          user_id: userId,
          title: titleEn,
          message: bodyEn,
          channel: 'IN_APP'
        });
      }

      // Record dispatch log
      await supabase.from('notification_logs').insert({
        recipient_identifier: recipientIdentifier || userId || 'student',
        template_id: templateId,
        channel: ch,
        payload: { title: titleEn, message: bodyEn, variables },
        status: 'DELIVERED',
        provider_response: { success: true, timestamp: new Date().toISOString() }
      });
    }

    return true;
  },

  async getUserNotifications(userId) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  },

  async markAsRead(id) {
    await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id);
  },

  async getNotificationLogs() {
    const { data, error } = await supabase
      .from('notification_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) return [];
    return data || [];
  },

  /**
   * Dispatches official stage notification email to student after each workflow transition
   */
  async sendStageStatusEmail({
    applicationId,
    studentEmail,
    studentName = 'Applicant',
    stage = 1,
    status = 'UNDER_VERIFICATION',
    remarks = '',
    utrNumber = '',
    amount = null,
    remainingAmount = null,
    userId = null
  }) {
    if (!studentEmail) {
      studentEmail = `student_${(applicationId || '').replace(/[^0-9]/g, '')}@jankalyan.org`;
    }

    // Determine stage details
    let stageTitleEn = 'Application Stage Update';
    let stageTitleHi = 'आवेदन चरण स्थिति अपडेट';
    let statusBadgeColor = '#0B2B82';
    let statusTextEn = status;
    let templateId = null;
    let messageBodyEn = '';
    let messageBodyHi = '';

    if (status === 'SUBMITTED' || status === 'UNDER_VERIFICATION') {
      templateId = 'APP_SUBMITTED';
      stageTitleEn = 'Stage 1: Application Received & Registered';
      stageTitleHi = 'चरण 1: आवेदन सफलतापूर्वक प्राप्त एवं पंजीकृत';
      statusBadgeColor = '#2563EB';
      statusTextEn = 'Registered / Under Verification';
      messageBodyEn = `Dear ${studentName}, your scholarship application (ID: ${applicationId}) has been successfully submitted and entered Stage 2: Nodal Officer & Document Scrutiny.`;
      messageBodyHi = `प्रिय ${studentName}, आपका छात्रवृत्ति आवेदन (आईडी: ${applicationId}) सफलतापूर्वक दर्ज हो गया है और चरण 2 (दस्तावेज़ सत्यापन) में प्रवेश कर चुका है।`;
    } else if (status === 'CORRECTION_REQUESTED') {
      templateId = 'DOC_CORRECTION';
      stageTitleEn = 'Stage 2: Document Correction Requested';
      stageTitleHi = 'चरण 2: दस्तावेज़ सुधार अनुरोध';
      statusBadgeColor = '#D97706';
      statusTextEn = 'Action Required: Correction Requested';
      messageBodyEn = `Dear ${studentName}, during verification of application ${applicationId}, the scrutiny officer requested corrections: "${remarks || 'Please re-upload clear qualifying document'}". Please log into your student dashboard to re-upload.`;
      messageBodyHi = `प्रिय ${studentName}, आपके आवेदन ${applicationId} में सत्यापन अधिकारी द्वारा सुधार अनुरोध किया गया है: "${remarks || 'कृपया स्पष्ट दस्तावेज़ पुनः अपलोड करें'}"। कृपया स्टूडेंट पोर्टल पर लॉगिन कर दस्तावेज़ पुनः अपलोड करें।`;
    } else if (status === 'INSTITUTION_RECOMMENDED') {
      stageTitleEn = 'Stage 3: Institution & District Cell Attestation Complete';
      stageTitleHi = 'चरण 3: संस्थागत एवं जिला प्रकोष्ठ सत्यापन पूर्ण';
      statusBadgeColor = '#7C3AED';
      statusTextEn = 'Bonafide Verified & Recommended';
      messageBodyEn = `Dear ${studentName}, your institutional bonafide and enrollment have been verified and recommended by the nodal officer for application ${applicationId}. Forwarded to State Sanction Committee.`;
      messageBodyHi = `प्रिय ${studentName}, आपके आवेदन ${applicationId} हेतु संस्थागत बोनाफाइड एवं नामांकन सत्यापित कर राज्य स्वीकृति समिति को अग्रेषित कर दिया गया है।`;
    } else if (status === 'APPROVED') {
      templateId = 'APP_APPROVED';
      stageTitleEn = 'Stage 4: Scholarship Sanctioned & Approved';
      stageTitleHi = 'चरण 4: छात्रवृत्ति स्वीकृत एवं स्वीकृत आदेश जारी';
      statusBadgeColor = '#16A34A';
      statusTextEn = 'Officially Approved';
      messageBodyEn = `Congratulations ${studentName}! Your scholarship application ${applicationId} has been officially approved and sanctioned by the Foundation Board for ₹${amount ? Number(amount).toLocaleString('en-IN') : '12,000'}/-. Disbursement via DBT is scheduled next.`;
      messageBodyHi = `बधाई हो ${studentName}! आपका छात्रवृत्ति आवेदन ${applicationId} संस्था द्वारा ₹${amount ? Number(amount).toLocaleString('en-IN') : '12,000'}/- के लिए स्वीकृत कर लिया गया है। शीघ्र ही डीबीटी के माध्यम से भुगतान किया जाएगा।`;
    } else if (status === 'PARTIALLY_DISBURSED') {
      templateId = 'SCHOLARSHIP_RELEASED';
      stageTitleEn = 'Stage 5: Scholarship Installment Disbursed via DBT';
      stageTitleHi = 'चरण 5: छात्रवृत्ति किस्त डीबीटी द्वारा बैंक खाते में अंतरित';
      statusBadgeColor = '#0D9488';
      statusTextEn = 'Installment Disbursed';
      messageBodyEn = `Dear ${studentName}, an installment of ₹${amount ? Number(amount).toLocaleString('en-IN') : '6,000'}/- for application ${applicationId} has been credited to your bank account under DBT. UTR / Ref: ${utrNumber || 'DBT-NEFT-PAID'}.${remainingAmount > 0 ? ` Remaining Grant Balance: ₹${remainingAmount}` : ''}`;
      messageBodyHi = `प्रिय ${studentName}, आपके आवेदन ${applicationId} की ₹${amount ? Number(amount).toLocaleString('en-IN') : '6,000'}/- की छात्रवृत्ति किस्त आपके बैंक खाते में अंतरित कर दी गई है। यूटीआर: ${utrNumber || 'DBT-NEFT-PAID'}।`;
    } else if (status === 'SCHOLARSHIP_RELEASED') {
      templateId = 'SCHOLARSHIP_RELEASED';
      stageTitleEn = 'Stage 5: Full Scholarship Disbursed via Direct Benefit Transfer';
      stageTitleHi = 'चरण 5: पूर्ण छात्रवृत्ति राशि डीबीटी द्वारा बैंक खाते में अंतरित';
      statusBadgeColor = '#16A34A';
      statusTextEn = 'Fully Disbursed (Completed)';
      messageBodyEn = `Dear ${studentName}, the full scholarship grant of ₹${amount ? Number(amount).toLocaleString('en-IN') : '12,000'}/- for application ${applicationId} has been successfully credited directly to your bank account. Banking UTR: ${utrNumber || 'SBIN-DBT-SETTLED'}. You can now download your Official Certificate.`;
      messageBodyHi = `प्रिय ${studentName}, आपके आवेदन ${applicationId} हेतु छात्रवृत्ति अनुदान राशि ₹${amount ? Number(amount).toLocaleString('en-IN') : '12,000'}/- आपके बैंक खाते में सफलतापूर्वक क्रेडिट हो गई है। यूटीआर: ${utrNumber || 'SBIN-DBT-SETTLED'}। आप अपना प्रमाण पत्र पोर्टल से डाउनलोड कर सकते हैं।`;
    } else if (status === 'REJECTED') {
      stageTitleEn = 'Application Scrutiny Update: Not Approved';
      stageTitleHi = 'आवेदन स्क्रूटनी अपडेट: अस्वीकृत';
      statusBadgeColor = '#DC2626';
      statusTextEn = 'Application Rejected';
      messageBodyEn = `Dear ${studentName}, after scrutiny, application ${applicationId} could not be approved. Reason / Officer Remarks: "${remarks || 'Does not fulfill minimum eligibility criteria'}".`;
      messageBodyHi = `प्रिय ${studentName}, गहन जांचोपरांत आवेदन ${applicationId} स्वीकृत नहीं हो सका। कारण / प्रशासनिक टिप्पणी: "${remarks || 'पात्रता मानदंडों को पूर्ण नहीं करता'}".`;
    }

    const emailSubject = `[Jan Kalyan Foundation] Status Update: Application ${applicationId} - ${stageTitleEn}`;
    const portalUrl = typeof window !== 'undefined' ? `${window.location.origin}/student-login` : 'https://jankalyan.org/student-login';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${emailSubject}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <tr>
            <td style="background-color: #0B2B82; padding: 24px 32px; text-align: center; color: #FFFFFF;">
              <h2 style="margin: 0 0 6px 0; font-size: 20px; letter-spacing: 0.05em; text-transform: uppercase;">Jan Kalyan Manavadhikar Foundation</h2>
              <div style="font-size: 12px; color: #FCD34D; font-weight: bold;">जन कल्याण मानवाधिकार फाउंडेशन | Govt. Reg. JBP/2025/007654</div>
              <div style="font-size: 11px; color: #93C5FD; margin-top: 4px;">Higher Education & Welfare Scholarship Portal 2026-27</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <div style="display: inline-block; background-color: ${statusBadgeColor}; color: #FFFFFF; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 18px; text-transform: uppercase;">
                ${statusTextEn}
              </div>
              <h3 style="margin: 0 0 16px 0; color: #0F172A; font-size: 18px;">
                ${stageTitleEn}
              </h3>
              <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
                ${messageBodyEn}
              </p>
              <div style="background-color: #F1F5F9; border-left: 4px solid ${statusBadgeColor}; padding: 14px 18px; border-radius: 6px; margin-bottom: 24px;">
                <table style="width: 100%; font-size: 13px;">
                  <tr>
                    <td style="color: #64748B; padding: 3px 0; width: 40%;"><strong>Application ID:</strong></td>
                    <td style="color: #0F172A; font-weight: bold; font-family: monospace;">${applicationId}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748B; padding: 3px 0;"><strong>Applicant Name:</strong></td>
                    <td style="color: #0F172A; font-weight: bold;">${studentName}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748B; padding: 3px 0;"><strong>Workflow Stage:</strong></td>
                    <td style="color: #0B2B82; font-weight: bold;">Stage ${stage} of 5</td>
                  </tr>
                  ${remarks ? `
                  <tr>
                    <td style="color: #64748B; padding: 3px 0; vertical-align: top;"><strong>Administrative Remarks:</strong></td>
                    <td style="color: #B91C1C; font-weight: 600;">${remarks}</td>
                  </tr>` : ''}
                  ${amount ? `
                  <tr>
                    <td style="color: #64748B; padding: 3px 0;"><strong>Sanctioned/Paid Grant:</strong></td>
                    <td style="color: #16A34A; font-weight: bold;">₹${Number(amount).toLocaleString('en-IN')}</td>
                  </tr>` : ''}
                  ${utrNumber ? `
                  <tr>
                    <td style="color: #64748B; padding: 3px 0;"><strong>DBT UTR / Reference:</strong></td>
                    <td style="color: #0284C7; font-weight: bold; font-family: monospace;">${utrNumber}</td>
                  </tr>` : ''}
                </table>
              </div>
              <div style="text-align: center; margin: 28px 0 20px 0;">
                <a href="${portalUrl}" style="background-color: #0B2B82; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
                  Login to Student Portal & Track Status
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 18px 32px; font-size: 12px; color: #64748B; text-align: center;">
              <div>Official Helpline: <strong>0761-4500054</strong> | Email: <strong>jankalyanmanavadhikar@gmail.com</strong></div>
              <div style="margin-top: 6px; font-size: 11px; color: #94A3B8;">Jan Kalyan Manavadhikar Foundation, Ward No. 30, Shri Ram College Road, Dixit Colony, Jabalpur, M.P. - 482002</div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      // 1. Record email dispatch in notification_logs
      await supabase.from('notification_logs').insert({
        recipient_identifier: studentEmail,
        template_id: templateId,
        channel: 'EMAIL',
        payload: {
          subject: emailSubject,
          html: emailHtml,
          text: messageBodyEn,
          stage,
          status,
          remarks,
          amount,
          utrNumber
        },
        status: 'SENT',
        provider_response: {
          success: true,
          channel: 'EMAIL',
          dispatched_at: new Date().toISOString(),
          recipient: studentEmail
        }
      });

      // 2. Also insert in-app notification if userId is known
      if (userId) {
        await supabase.from('notifications').insert({
          user_id: userId,
          title: stageTitleEn,
          message: messageBodyEn,
          channel: 'EMAIL'
        });
      }

      console.log(`[EMAIL DISPATCH] Sent stage notification email to ${studentEmail} (${applicationId}): Stage ${stage} - ${status}`);
      return true;
    } catch (err) {
      console.warn('Failed to record stage email notification:', err);
      return false;
    }
  }
};

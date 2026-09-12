import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Download, 
  Printer, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Bell, 
  FileCheck, 
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';

export const StudentDashboard = () => {
  const { lang, t, navigate, activeStudentApp, cms, grievances } = useApp();
  const student = activeStudentApp;

  const studentGrievances = grievances.filter(g => g.applicationId === student.id || g.mobile === student.mobile);

  return (
    <div className="section-py" style={{ backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Welcome Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-navy" style={{ marginBottom: '0.4rem' }}>
              {lang === 'hi' ? 'विद्यार्थी पोर्टल' : 'STUDENT SCHOLARSHIP PORTAL'}
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A' }}>
              {lang === 'hi' ? `नमस्ते, ${student.studentName}` : `Welcome, ${student.studentName}`}
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              Application ID: <strong style={{ color: '#1E40AF' }}>{student.id}</strong> | Mobile: {student.mobile}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/track')}>
              <span>{t.heroCtaTrack}</span>
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
              <Printer size={15} />
              <span>{t.btnDownloadReceipt}</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
          
          {/* Left Column: Application Details & Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Live Status Card */}
            <div className="card" style={{ borderTop: '4px solid #1E40AF' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                  {t.dashAppDetails}
                </h3>
                <span className={`badge ${
                  student.status === 'Scholarship Released' ? 'badge-green' :
                  student.status === 'Approved' ? 'badge-blue' :
                  student.status === 'Rejected' ? 'badge-red' :
                  student.status === 'Correction Requested' ? 'badge-yellow' : 'badge-navy'
                }`}>
                  {student.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <div><strong>Class / Course:</strong> {student.course}</div>
                <div><strong>Institution:</strong> {student.institution}</div>
                <div><strong>District:</strong> {student.district}</div>
                <div><strong>Social Category:</strong> {student.category}</div>
                <div><strong>Submission Date:</strong> {student.submissionDate}</div>
                <div><strong>Bank Name:</strong> {student.bankName}</div>
              </div>

              {/* Progress Stepper Miniature */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#1B2A4E', marginBottom: '0.5rem' }}>
                  <span>Stage {student.stage} of 5</span>
                  <span>{student.status}</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(student.stage / 5) * 100}%`, backgroundColor: student.status === 'Rejected' ? '#DC2626' : '#16A34A', transition: 'width 0.3s' }} />
                </div>
              </div>
            </div>

            {/* Payment & DBT Release Status */}
            <div className="card" style={{ borderTop: '4px solid #16A34A' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <CreditCard size={22} color="#16A34A" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                  {t.dashPayment}
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Scholarship Amount</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16A34A', margin: '0.25rem 0' }}>
                    <span className="editable-field">{student.disbursedAmount}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Direct Bank Transfer</div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Payment Status</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0.25rem 0' }}>
                    {student.paymentDate === 'Queued' || student.paymentDate === 'In Payment Queue' ? 'In Bank Queue' : student.paymentDate !== '-' ? 'Released' : 'Under Review'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Date: {student.paymentDate}</div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>UTR / Ref No.</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E40AF', fontFamily: 'monospace', margin: '0.25rem 0' }}>
                    {student.utrNumber}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Banking Acknowledgment</div>
                </div>
              </div>
            </div>

            {/* Documents Scrutiny Quick Status */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                  {t.dashDocs}
                </h3>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/documents')}>
                  <span>Manage All</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Object.entries(student.documents || {}).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{key}</span>
                    <span className={`badge ${val.status === 'Verified' ? 'badge-green' : val.status === 'Rejected' ? 'badge-red' : 'badge-navy'}`}>
                      {val.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Notifications & Grievance Tickets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Quick Downloads Card */}
            <div className="card" style={{ backgroundColor: '#1B2A4E', color: '#FFFFFF' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem' }}>
                {lang === 'hi' ? 'आधिकारिक डाउनलोड' : 'Official Downloads'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button 
                  className="btn btn-outline-white btn-sm"
                  style={{ justifyContent: 'space-between' }}
                  onClick={() => window.print()}
                >
                  <span>Application Acknowledgement Slip</span>
                  <Printer size={14} />
                </button>
                <button 
                  className="btn btn-outline-white btn-sm"
                  style={{ justifyContent: 'space-between' }}
                  onClick={() => navigate('/downloads')}
                >
                  <span>Scheme Guidelines 2026-27</span>
                  <Download size={14} />
                </button>
              </div>
            </div>

            {/* Notifications Box */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Bell size={18} color="#1E40AF" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                  {lang === 'hi' ? 'महत्वपूर्ण सूचनाएं' : 'Recent Notifications'}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ borderLeft: '3px solid #16A34A', paddingLeft: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>2026-09-10</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Document Scrutiny Ongoing</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Your submitted records are currently under district coordinator review.</div>
                </div>

                <div style={{ borderLeft: '3px solid #1E40AF', paddingLeft: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>2026-09-02</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Application Successfully Registered</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Your registration ID {student.id} was generated successfully.</div>
                </div>
              </div>
            </div>

            {/* Grievance Status & Help */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                  {t.dashGrievance}
                </h3>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/grievance')}>
                  <span>Raise New</span>
                </button>
              </div>

              {studentGrievances.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {studentGrievances.map((g) => (
                    <div key={g.id} style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                        <span>{g.id}</span>
                        <span className="badge badge-yellow">{g.status}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>{g.category}: {g.description}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: '#64748B', textAlign: 'center', padding: '1rem 0' }}>
                  No active grievances filed. Need help?
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

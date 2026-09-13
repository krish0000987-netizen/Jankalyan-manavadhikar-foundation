import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Target, 
  Compass, 
  Award, 
  BookOpen, 
  CheckCircle, 
  Users, 
  Lock, 
  TrendingUp, 
  HeartHandshake,
  ArrowRight,
  Eye,
  FileCheck2
} from 'lucide-react';

export const About = () => {
  const { lang, t, navigate, cms } = useApp();

  return (
    <div>
      {/* Page Hero Banner */}
      <section style={{ backgroundColor: '#1B2A4E', color: '#FFFFFF', padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '780px' }}>
            <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FEF08A', marginBottom: '1rem' }}>
              {lang === 'hi' ? 'संस्थागत परिचय' : 'INSTITUTIONAL PROFILE'}
            </span>
            <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem', lineHeight: 1.2 }}>
              {lang === 'hi' ? 'जनकल्याण मानवाधिकार फाउंडेशन के बारे में' : 'About Jankalyan Manavadhikar Foundation'}
            </h1>
            <p style={{ color: '#CBD5E1', fontSize: '1.15rem', lineHeight: 1.65 }}>
              {lang === 'hi' 
                ? 'मानवाधिकार संरक्षण, शैक्षणिक प्रोत्साहन एवं पारदर्शी सामाजिक कल्याण हेतु समर्पित एक निष्पक्ष एवं स्वायत्त संस्था।'
                : 'An autonomous initiative committed to human rights safeguarding, educational enablement, and transparent scholastic advancement.'}
            </p>
          </div>
        </div>
      </section>

      {/* Section 1 & 2: Introduction & Purpose */}
      <section className="section-py" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>
                {lang === 'hi' ? '1. संस्था का परिचय' : '1. Foundation Introduction'}
              </span>
              <h2 style={{ fontSize: '2.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem' }}>
                {lang === 'hi' ? 'शिक्षा और मानवाधिकार का अटूट समन्वय' : 'Fostering Dignity, Rights, and Education'}
              </h2>
              <p style={{ color: '#334155', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                {lang === 'hi'
                  ? 'जनकल्याण मानवाधिकार फाउंडेशन का गठन समाज के वंचित, आर्थिक रूप से कमजोर एवं होनहार छात्र-छात्राओं को सर्वांगीण शैक्षणिक अवसर उपलब्ध कराने के उद्देश्य से किया गया है। संस्था का दृढ़ विश्वास है कि शिक्षा ही मानवीय गरिमा और अधिकारों की वास्तविक संवाहिका है।'
                  : 'Jankalyan Manavadhikar Foundation was instituted with a resolute vision to dismantle economic and institutional barriers faced by promising students across India. We believe education is the single most transformative pillar of human dignity.'}
              </p>
              
              <div style={{ borderLeft: '4px solid #DC2626', paddingLeft: '1.25rem', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 700, color: '#0F172A', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                  {lang === 'hi' ? '2. हमारा मुख्य उद्देश्य (Purpose)' : '2. Institutional Purpose'}
                </h4>
                <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {lang === 'hi'
                    ? 'प्रत्येक योग्य विद्यार्थी तक प्रत्यक्ष सहायता पहुंचाना, बिना किसी बिचौलिए के पारदर्शी सत्यापन सुनिश्चित करना, तथा किसी भी विद्यार्थी की पढ़ाई धन के अभाव में न रुके, यह ध्येय पूर्ण करना।'
                    : 'To bridge the gap between academic aspiration and economic constraints through an immutable, merit-and-need verified digital ecosystem.'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#F8FAFC', padding: '0.85rem 1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <ShieldCheck size={20} color="#16A34A" />
                <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
                  {t.govtAffiliationDisclaimer}
                </span>
              </div>
            </div>

            <div>
              <img 
                src="/assets/about_education.jpg" 
                alt="Educational Empowerment" 
                style={{ width: '100%', height: '440px', objectFit: 'cover', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 & 4: Mission & Vision */}
      <section className="section-py" style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div className="grid-2">
            
            <div className="card" style={{ padding: '2.5rem', borderTop: '5px solid #1E40AF' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Target size={30} color="#1E40AF" />
              </div>
              <span className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>
                {lang === 'hi' ? '3. हमारा ध्येय (Mission)' : '3. Our Mission'}
              </span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
                {lang === 'hi' ? 'प्रत्येक होनहार छात्र को आर्थिक सुरक्षा' : 'Empowering Academic Potential'}
              </h3>
              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7 }}>
                {lang === 'hi'
                  ? 'हमारा मिशन भारत के ग्रामीण, कस्बाई एवं शहरी क्षेत्रों में आर्थिक संकट से जूझ रहे मेधावी छात्र-छात्राओं की पहचान कर उन्हें छात्रवृत्ति सहायता प्रदान करना है। आधुनिक डिजिटल तकनीक का उपयोग करते हुए प्रक्रिया को 100% पारदर्शी और निष्पक्ष बनाना हमारा संकल्प है।'
                  : 'To identify, verify, and assist deserving students across rural and urban landscapes through a digitally verifiable, merit-cum-means scholarship framework that operates with zero bureaucracy.'}
              </p>
            </div>

            <div className="card" style={{ padding: '2.5rem', borderTop: '5px solid #DC2626' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Compass size={30} color="#DC2626" />
              </div>
              <span className="badge badge-red" style={{ marginBottom: '0.75rem' }}>
                {lang === 'hi' ? '4. हमारा दृष्टिकोण (Vision)' : '4. Our Vision'}
              </span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
                {lang === 'hi' ? 'समानता एवं ज्ञान-आधारित समाज' : 'An Equitable Knowledge-Driven Society'}
              </h3>
              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7 }}>
                {lang === 'hi'
                  ? 'एक ऐसे भारत का निर्माण जहां प्रत्येक बच्चे को उसकी सामाजिक या आर्थिक स्थिति की परवाह किए बिना अपनी क्षमता के उच्चतम स्तर तक शिक्षा प्राप्त करने का पूर्ण अधिकार और अवसर मिले।'
                  : 'An inclusive India where every aspiring learner has unconditional access to scholastic resources, fostering self-reliance, leadership, and community advancement.'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Section 5 & 6: Educational & Scholarship Initiatives */}
      <section className="section-py" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="grid-editorial" style={{ alignItems: 'center' }}>
            <div>
              <img 
                src="/assets/hero_slide_2.jpg" 
                alt="Students collaborating" 
                style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
              />
            </div>

            <div>
              <span className="badge badge-yellow" style={{ marginBottom: '1rem' }}>
                {lang === 'hi' ? '5 & 6. शैक्षणिक एवं छात्रवृत्ति पहल' : '5 & 6. Educational Initiatives'}
              </span>
              <h2 style={{ fontSize: '2.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem' }}>
                {lang === 'hi' ? 'छात्रवृत्ति योजना: एक दूरगामी संस्थागत प्रयास' : 'Scholarship Yojna: Direct Impact'}
              </h2>
              <p style={{ color: '#334155', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                {lang === 'hi'
                  ? 'फाउंडेशन केवल आर्थिक सहयोग तक सीमित नहीं है, बल्कि यह विद्यार्थियों के शैक्षणिक मार्गदर्शन, करियर परामर्श तथा प्रमाण पत्र संवीक्षा के माध्यम से उन्हें स्वावलंबी बनाने हेतु निरंतर प्रयासरत है।'
                  : 'Beyond direct financial relief, our scholarship initiative partners with schools, colleges, and regional coordinators to support holistic student enablement, digital literacy, and career development.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle size={20} color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.95rem', color: '#1E293B' }}>
                    {lang === 'hi' ? 'सीधे बैंक खाते में डीबीटी अंतरण (Direct Benefit Transfer)' : 'Direct Benefit Transfer into verified student accounts'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle size={20} color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.95rem', color: '#1E293B' }}>
                    {lang === 'hi' ? 'जिला एवं ब्लॉक स्तर पर संस्थागत सत्यापन व्यवस्था' : 'Multi-tier scrutiny via District and Block coordinators'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle size={20} color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.95rem', color: '#1E293B' }}>
                    {lang === 'hi' ? 'पूर्णतः निःशुल्क ऑनलाइन आवेदन एवं पारदर्शी ट्रैकिंग' : 'Completely fee-free application with live status tracking'}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <button className="btn btn-primary" onClick={() => navigate('/scholarship')}>
                  <span>{lang === 'hi' ? 'छात्रवृत्ति योजना विस्तार से देखें' : 'Explore Scholarship Details'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Core Values */}
      <section className="section-py" style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-navy" style={{ marginBottom: '0.75rem' }}>
              {lang === 'hi' ? '7. हमारे मूल सिद्धांत' : '7. Core Institutional Values'}
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A' }}>
              {lang === 'hi' ? 'जिन सिद्धांतों पर हम कार्य करते हैं' : 'Pillars of Our Foundation'}
            </h2>
          </div>

          <div className="grid-4">
            
            <div className="card">
              <div style={{ color: '#1E40AF', marginBottom: '1rem' }}><Lock size={26} /></div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                {lang === 'hi' ? 'पारदर्शिता (Transparency)' : 'Transparency'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>
                {lang === 'hi' ? 'आवेदन की प्राप्ति से लेकर स्वीकृति व राशि अंतरण तक प्रत्येक कदम सार्वजनिक सत्यापन योग्य है।' : 'Verifiable audit trails and live status tracking accessible by every applicant.'}
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#DC2626', marginBottom: '1rem' }}><HeartHandshake size={26} /></div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                {lang === 'hi' ? 'सहानुभूति व गरिमा (Dignity)' : 'Empathy & Dignity'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>
                {lang === 'hi' ? 'सहायता को अधिकार के रूप में प्रदान करना ताकि विद्यार्थी स्वाभिमान से अध्ययन कर सकें।' : 'Treating education as an inviolable right with utmost dignity.'}
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#D97706', marginBottom: '1rem' }}><Award size={26} /></div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                {lang === 'hi' ? 'योग्यता व निष्पक्षता (Merit)' : 'Fairness & Merit'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>
                {lang === 'hi' ? 'बिना किसी पक्षपात या भेदभाव के वास्तविक आवश्यकता और पात्रता के आधार पर चयन।' : 'Unbiased, objective evaluation strictly aligned with defined criteria.'}
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#16A34A', marginBottom: '1rem' }}><TrendingUp size={26} /></div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                {lang === 'hi' ? 'दीर्घकालिक प्रभाव (Impact)' : 'Long-term Impact'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>
                {lang === 'hi' ? 'विद्यार्थियों को सशक्त बनाकर समाज व राष्ट्र निर्माण में योगदान।' : 'Nurturing educated, responsible citizens who lead positive change.'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Section 8: Team (CMS-Driven, No Invented Names) */}
      <section className="section-py" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>
              {lang === 'hi' ? '8. संस्थागत नेतृत्व' : '8. Institutional Governance'}
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              {lang === 'hi' ? 'प्रबंधन एवं संचालन समिति' : 'Executive & Scrutiny Board'}
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              {lang === 'hi' ? 'समिति के आधिकारिक प्रोफाइल (CMS द्वारा संपादन योग्य)' : 'Official leadership roles configured via Foundation CMS'}
            </p>
          </div>

          <div className="grid-3">
            {cms.teamMembers.map((member) => (
              <div key={member.id} className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  backgroundColor: '#EFF6FF', 
                  color: '#1E40AF',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 1.25rem',
                  border: '2px solid #BFDBFE'
                }}>
                  <Users size={36} />
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                  {member.name}
                </h4>
                <div style={{ fontSize: '0.85rem', color: '#DC2626', fontWeight: 600, marginBottom: '1rem' }}>
                  {lang === 'hi' ? member.roleHi : member.roleEn}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>
                  {lang === 'hi' ? member.bioHi : member.bioEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 9 & 10: Transparency & Future Vision */}
      <section className="section-py" style={{ backgroundColor: '#1B2A4E', color: '#FFFFFF' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FEF08A', marginBottom: '1rem' }}>
                {lang === 'hi' ? '9. संस्थागत पारदर्शिता' : '9. Institutional Transparency'}
              </span>
              <h2 style={{ fontSize: '2.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem' }}>
                {lang === 'hi' ? 'प्रत्येक रुपए का पारदर्शी हिसाब' : 'Accountable at Every Step'}
              </h2>
              <p style={{ color: '#CBD5E1', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                {lang === 'hi'
                  ? 'फाउंडेशन अपने सभी वित्तीय संवितरणों, छात्रवृत्ति अनुमोदन तथा समन्वयक कार्यों में पूर्ण पारदर्शिता बनाए रखने हेतु कटिबद्ध है। किसी भी प्रकार की अनियमितता पाए जाने पर तत्काल संज्ञान लिया जाता है।'
                  : 'We mandate strict governance policies, digital records, direct bank transfer verification, and an active grievance redressal cell to ensure flawless execution.'}
              </p>
              
              <div style={{ marginTop: '2rem' }}>
                <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#60A5FA', marginBottom: '0.75rem' }}>
                  {lang === 'hi' ? '10. भविष्य का दृष्टिकोण' : '10. Future Vision'}
                </span>
                <p style={{ color: '#CBD5E1', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {lang === 'hi'
                    ? 'आने वाले सत्रों में फाउंडेशन अधिक से अधिक जरूरतमंद विद्यार्थियों तक पहुंच बनाने और उन्हें तकनीकी शिक्षा से जोड़ने हेतु नए डिजिटल संसाधन उपलब्ध कराने के लिए अग्रसर है।'
                    : 'Expanding outreach to unrepresented rural blocks and integrating AI-driven digital mentoring to support our scholars throughout their academic journey.'}
                </p>
              </div>
            </div>

            <div>
              <img 
                src="/assets/hero_slide_6.jpg" 
                alt="Vision for Education" 
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.15)' }}
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

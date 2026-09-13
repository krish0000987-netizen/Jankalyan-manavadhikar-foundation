-- ============================================================================
-- Migration 09: Seed Master Data, Initial CMS Defaults & Authentic Applications
-- Jankalyan Manavadhikar Foundation
-- ============================================================================

-- 1. Seed Districts
INSERT INTO public.districts (id, name, code, state) VALUES
('a0000000-0000-0000-0000-000000000001', 'Jabalpur', 'JBP', 'Madhya Pradesh'),
('a0000000-0000-0000-0000-000000000002', 'Bhopal', 'BPL', 'Madhya Pradesh'),
('a0000000-0000-0000-0000-000000000003', 'Indore', 'IND', 'Madhya Pradesh'),
('a0000000-0000-0000-0000-000000000004', 'Rewa', 'REW', 'Madhya Pradesh'),
('a0000000-0000-0000-0000-000000000005', 'Mandla', 'MAN', 'Madhya Pradesh'),
('a0000000-0000-0000-0000-000000000006', 'Gwalior', 'GWL', 'Madhya Pradesh')
ON CONFLICT (name) DO NOTHING;

-- 2. Seed Blocks
INSERT INTO public.blocks (id, district_id, name, code) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Patan', 'PAT'),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Kundam', 'KUN'),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'Berasia', 'BER'),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'Phanda', 'PHA'),
('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', 'Mhow', 'MHO'),
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000003', 'Sanwer', 'SAN'),
('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000004', 'Raipur Karchuliyan', 'RKC'),
('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000005', 'Bichhiya', 'BIC'),
('b0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000006', 'Dabra', 'DAB')
ON CONFLICT (district_id, name) DO NOTHING;

-- 3. Seed Institutions
INSERT INTO public.institutions (id, name, category, code, district_id, block_id, address) VALUES
('c0000000-0000-0000-0000-000000000001', 'Govt. Model Higher Secondary School', 'School', 'SCH-JBP-01', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Patan Road, Jabalpur'),
('c0000000-0000-0000-0000-000000000002', 'Barkatullah University College', 'College', 'COL-BPL-02', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 'Hoshangabad Road, Bhopal'),
('c0000000-0000-0000-0000-000000000003', 'Holkar Science College', 'College', 'COL-IND-03', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000005', 'AB Road, Indore'),
('c0000000-0000-0000-0000-000000000004', 'Govt. Polytechnic College Rewa', 'Polytechnic', 'POL-REW-04', 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000007', 'Kothi Compound, Rewa'),
('c0000000-0000-0000-0000-000000000005', 'Govt. Girls Higher Secondary School', 'School', 'SCH-MAN-05', 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000008', 'Main Market, Bichhiya, Mandla'),
('c0000000-0000-0000-0000-000000000006', 'Madhav Institute of Technology', 'College', 'COL-GWL-06', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000009', 'Gola Ka Mandir, Gwalior')
ON CONFLICT (code) DO NOTHING;

-- 4. Seed Active Scholarship Scheme
INSERT INTO public.scholarship_schemes (id, code, name, description, academic_year, grant_amount, grant_amount_display, application_start_date, application_end_date, application_fee, is_fee_applicable, eligibility_overview, is_active) VALUES
('d0000000-0000-0000-0000-000000000001', 'JMF-SCHOLARSHIP-2026', 'Jankalyan Manavadhikar Foundation Scholarship Yojna 2026-27', 'Direct Benefit Transfer scholarship grant for meritorious and economically vulnerable students across India.', '2026-27', 12000.00, '₹12,000 / Academic Session', '2026-08-01', '2026-10-31', 0.00, false, 'Class 10th/12th/Graduation/Diploma students with min 50% marks in qualifying exam and family annual income up to ₹3,00,000.', true)
ON CONFLICT (code) DO UPDATE SET
    grant_amount = EXCLUDED.grant_amount,
    grant_amount_display = EXCLUDED.grant_amount_display;

-- 5. Seed System Settings
INSERT INTO public.system_settings (key, value, description, is_public) VALUES
('portal_config', '{"foundation_name": "Jankalyan Manavadhikar Foundation", "helpline_mobile": "8871557054", "helpline_telephone": "07614500054", "official_email": "jankalyanmanavadhikar@gmail.com", "office_address": "Near High Court Road, Jabalpur, Madhya Pradesh - 482001", "registration_number": "JMF/MP/NGO/2026/894", "application_fee": 0, "maintenance_mode": false}'::jsonb, 'Global institutional settings', true),
('stats_display_config', '{"show_total_applications": true, "show_approved_count": true, "show_disbursed_count": true, "show_districts_count": true}'::jsonb, 'Public counter visibility toggle', true)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 6. Seed Dynamic Hero Slides
INSERT INTO public.hero_slides (id, image_url, eyebrow_en, eyebrow_hi, heading_en, heading_hi, description_en, description_hi, display_order, is_active, slide_duration_ms) VALUES
('e0000000-0000-0000-0000-000000000001', '/assets/hero_slide_1.jpg', 'Empowering Tomorrow, Today', 'उज्ज्वल भविष्य, आज से', 'Dedicated to Human Rights & Direct Scholastic Empowerment', 'मानवाधिकार संरक्षण एवं प्रत्यक्ष शैक्षणिक प्रोत्साहन', 'Empowering deserving and meritorious students across India with direct scholastic grants, verifiable multi-tier scrutiny, and transparent Direct Benefit Transfer.', 'भारत भर के मेधावी एवं जरूरतमंद छात्र-छात्राओं को प्रत्यक्ष छात्रवृत्ति अनुदान, पारदर्शी बहु-स्तरीय संवीक्षा एवं प्रत्यक्ष लाभ अंतरण (DBT) द्वारा सशक्त बनाना।', 1, true, 3000),
('e0000000-0000-0000-0000-000000000002', '/assets/hero_slide_2.jpg', 'Quality Higher Education', 'गुणवत्तापूर्ण उच्च शिक्षा', 'Supporting Academic Ambition Across Colleges & Universities', 'महाविद्यालयीन एवं विश्वविद्यालयीन छात्रों को आर्थिक संबल', 'Providing unconditional financial security so no aspiring student is forced to discontinue their higher education due to financial hardship.', 'प्रत्येक मेधावी युवा की उच्च शिक्षा को निरंतर रखने हेतु निर्बाध वित्तीय सुरक्षा एवं संस्थागत सहयोग।', 2, true, 3000),
('e0000000-0000-0000-0000-000000000003', '/assets/hero_slide_3.jpg', 'Grassroots Classroom Impact', 'कक्षा तक प्रत्यक्ष पहुंच', 'Direct Financial Assistance Delivered to Deserving Classrooms', 'प्रत्येक पात्र विद्यार्थी तक शत-प्रतिशत निष्पक्ष सहायता', 'Ensuring direct benefit transfer into verified student bank accounts with zero middleman interference and instant status tracking.', 'बिना किसी बिचौलिए के सीधे विद्यार्थी के आधार-लिंक्ड बैंक खाते में प्रत्यक्ष अंतरण एवं त्वरित स्थिति ट्रैकिंग।', 3, true, 3000),
('e0000000-0000-0000-0000-000000000004', '/assets/hero_slide_4.jpg', 'Scholastic Excellence', 'शैक्षणिक उत्कृष्टता', 'Recognizing Merit, Dedication, and Resilient Aspirations', 'प्रतिभा, लगन एवं परिश्रम का सच्चा सम्मान', 'Awarding scholarship certificates, timely grants, and academic recognition through our unified digital portal.', 'एकल डिजिटल पोर्टल के माध्यम से आधिकारिक प्रमाण पत्र, समयबद्ध छात्रवृत्ति अनुदान एवं शैक्षणिक सम्मान।', 4, true, 3000),
('e0000000-0000-0000-0000-000000000005', '/assets/hero_slide_5.jpg', 'Digital India Integration', 'डिजिटल सशक्तिकरण', '100% Paperless Online Verification & Redressal Cell', 'शत-प्रतिशत कागजरहित ऑनलाइन सत्यापन एवं समाधान', 'Experience end-to-end transparency with QR-verifiable application receipts, grievance resolution within 48 hours, and live SMS updates.', 'क्यूआर कोड युक्त रसीद, 48 घंटे में शिकायत निवारण और रियल-टाइम एसएमएस अलर्ट के साथ संपूर्ण पारदर्शिता।', 5, true, 3000),
('e0000000-0000-0000-0000-000000000006', '/assets/hero_slide_6.jpg', 'Research & Library Support', 'शोध एवं पुस्तकालय संवर्धन', 'Encouraging Research, Innovation, and Higher Studies', 'उच्च अध्ययन, शोध एवं नवाचार को प्रोत्साहन', 'Facilitating scholastic grants for polytechnic, technical, degree, and postgraduate learners nationwide.', 'पॉलिटेक्निक, तकनीकी, स्नातक एवं स्नातकोत्तर शिक्षार्थियों हेतु राष्ट्रव्यापी छात्रवृत्ति सहायता।', 6, true, 3000)
ON CONFLICT (id) DO NOTHING;

-- 7. Seed Announcements
INSERT INTO public.announcements (id, text_en, text_hi, display_order, is_active) VALUES
('f0000000-0000-0000-0000-000000000001', 'Scholarship applications are now open for the current academic session 2026-27.', 'वर्तमान शैक्षणिक सत्र 2026-27 के लिए छात्रवृत्ति आवेदन प्रारंभ हो चुके हैं।', 1, true),
('f0000000-0000-0000-0000-000000000002', 'Please ensure your bank account is Aadhaar-seeded for Direct Benefit Transfer (DBT).', 'कृपया प्रत्यक्ष लाभ अंतरण (DBT) हेतु सुनिश्चित करें कि आपका बैंक खाता आधार से लिंक हो।', 2, true),
('f0000000-0000-0000-0000-000000000003', 'Verification centers are actively reviewing submitted documents across all districts.', 'सत्यापन केंद्रों द्वारा सभी जिलों में जमा किए गए दस्तावेज़ों की संवीक्षा सक्रिय रूप से की जा रही है।', 3, true)
ON CONFLICT (id) DO NOTHING;

-- 8. Seed Notices
INSERT INTO public.notices (id, title_en, title_hi, category_en, category_hi, content_en, content_hi, priority, publish_date, is_pinned, is_published) VALUES
('NOT-2026-01', 'Online Application Guidelines & Document Verification Protocol', 'ऑनलाइन आवेदन दिशा-निर्देश एवं दस्तावेज़ सत्यापन प्रक्रिया', 'Guidelines', 'दिशा-निर्देश', 'Students must review all institutional requirements before submitting documents. Ensure high-resolution scans of original marksheets and current bonafide certificates.', 'विद्यार्थी दस्तावेज़ जमा करने से पूर्व सभी संस्थागत आवश्यकताओं की समीक्षा करें। मूल अंकसूची व वर्तमान बोनाफाइड प्रमाण पत्र की स्पष्ट स्कैन प्रति अपलोड करें।', 'HIGH', '2026-09-10', true, true),
('NOT-2026-02', 'Advisory on Bank Account Linking with Aadhaar (DBT Compliance)', 'आधार से बैंक खाता लिंक करने संबंधी आवश्यक परामर्श (DBT अनुपालन)', 'Advisory', 'परामर्श', 'Payments will only be disbursed through Direct Benefit Transfer. Inoperative or unlinked accounts will cause transaction failure.', 'छात्रवृत्ति राशि केवल प्रत्यक्ष लाभ अंतरण द्वारा जारी होगी। निष्क्रिय या असंबद्ध खातों में लेन-देन विफल हो सकता है।', 'CRITICAL', '2026-09-05', true, true),
('NOT-2026-03', 'District & Block Coordinator Scrutiny Schedule', 'जिला एवं ब्लॉक समन्वयकों हेतु संवीक्षा समय-सारणी', 'Administration', 'प्रशासनिक', 'Institutional coordinators must expedite primary stage verification of received applications within 5 working days.', 'संस्थागत समन्वयकों को प्राप्त आवेदनों का प्राथमिक सत्यापन 5 कार्यदिवसों के भीतर पूर्ण करना अनिवार्य है।', 'NORMAL', '2026-08-28', false, true)
ON CONFLICT (id) DO NOTHING;

-- 9. Seed FAQs
INSERT INTO public.faqs (id, question_en, question_hi, answer_en, answer_hi, category, display_order, is_active) VALUES
('FAQ-01', 'How do I apply for the Jankalyan Manavadhikar Foundation Scholarship?', 'जंकल्याण मानवाधिकार फाउंडेशन छात्रवृत्ति के लिए आवेदन कैसे करें?', 'Click on Apply Now, register with your mobile number, verify OTP, complete the 8-step application form with personal, academic, and bank details, upload required documents, and submit to receive your unique Application ID.', 'अभी आवेदन करें बटन पर क्लिक करें, मोबाइल नंबर दर्ज कर ओटीपी सत्यापित करें, 8-चरणीय फॉर्म में व्यक्तिगत, शैक्षणिक व बैंक विवरण भरें, दस्तावेज़ अपलोड कर आवेदन जमा करें।', 'Application', 1, true),
('FAQ-02', 'Which documents are compulsory for application?', 'आवेदन हेतु कौन-कौन से दस्तावेज़ अनिवार्य हैं?', 'Compulsory documents include: (1) Passport-size Photograph, (2) Aadhaar Card, (3) Previous Examination Marksheet, (4) Institutional Bonafide/Admission Receipt, (5) Bank Passbook copy. Income and Caste certificates are required if applying under reserved/need categories.', 'अनिवार्य दस्तावेज़: (1) पासपोर्ट फोटो, (2) आधार कार्ड, (3) पिछली कक्षा की अंकसूची, (4) संस्थान बोनाफाइड/प्रवेश रसीद, (5) बैंक पासबुक प्रति। आरक्षित वर्ग हेतु आय व जाति प्रमाण पत्र आवश्यक हैं।', 'Documents', 2, true),
('FAQ-03', 'When and how will the scholarship amount be disbursed?', 'छात्रवृत्ति राशि कब और कैसे जारी की जाएगी?', 'Upon successful scrutiny and committee approval, the scholarship amount is transferred directly to the student verified bank account through Direct Benefit Transfer (DBT). UTR number and disbursement date can be tracked on the portal.', 'सत्यापन एवं अनुमोदन उपरांत छात्रवृत्ति राशि सीधे विद्यार्थी के बैंक खाते में प्रत्यक्ष लाभ अंतरण (DBT) द्वारा अंतरित की जाती है। यूटीआर संख्या पोर्टल पर ट्रैक की जा सकती है।', 'Payment', 3, true),
('FAQ-04', 'Is there any application fee to apply?', 'क्या आवेदन करने का कोई शुल्क है?', 'The foundation does not charge any application fee. The online submission portal is free for eligible students.', 'फाउंडेशन द्वारा आवेदन हेतु कोई शुल्क नहीं लिया जाता है। पात्र विद्यार्थियों के लिए ऑनलाइन पोर्टल पूर्णतः निःशुल्क है।', 'General', 4, true),
('FAQ-05', 'How can I track the live status of my application?', 'मैं अपने आवेदन की स्थिति कैसे देख सकता हूँ?', 'Navigate to Track Application in the top header, enter your Application ID (e.g. JMF-2026-XXXXXX) or registered mobile number, and view your real-time processing timeline.', 'शीर्ष मेनू में आवेदन ट्रैक करें पर जाएं, अपनी Application ID (उदा. JMF-2026-XXXXXX) अथवा पंजीकृत मोबाइल नंबर दर्ज करें और लाइव स्थिति देखें।', 'Tracking', 5, true),
('FAQ-06', 'What should I do if my document is marked Rejected?', 'यदि मेरा कोई दस्तावेज़ अस्वीकार (Rejected) हो जाए तो क्या करें?', 'Log in to the Student Dashboard or visit the Documents page. You will see the specific rejection reason. You can upload a fresh, clear replacement copy without filling the entire application again.', 'विद्यार्थी डैशबोर्ड अथवा दस्तावेज़ पृष्ठ पर जाएं। वहां अस्वीकृति का कारण प्रदर्शित होगा। आप संपूर्ण फॉर्म दोबारा भरे बिना नया स्पष्ट दस्तावेज़ पुनः अपलोड कर सकते हैं।', 'Scrutiny', 6, true),
('FAQ-07', 'What if I forget my Application ID?', 'यदि मैं अपनी Application ID भूल जाऊं तो क्या करें?', 'You can track your application directly using your registered mobile number, or contact the helpline at 8871557054 / jankalyanmanavadhikar@gmail.com with your student details.', 'आप अपने पंजीकृत मोबाइल नंबर द्वारा भी आवेदन ट्रैक कर सकते हैं, अथवा हेल्पलाइन 8871557054 / jankalyanmanavadhikar@gmail.com पर संपर्क कर सकते हैं।', 'Support', 7, true)
ON CONFLICT (id) DO NOTHING;

-- 10. Seed Team Members
INSERT INTO public.team_members (id, name, role_en, role_hi, bio_en, bio_hi, display_order, is_active) VALUES
('10000000-0000-0000-0000-000000000001', 'Foundation Patron / Director', 'Executive Board / Trustee', 'कार्यकारी बोर्ड / ट्रस्टी', 'Dedicated to human rights, educational upliftment, and transparent institutional governance.', 'मानवाधिकार, शैक्षणिक उत्थान एवं पारदर्शी संस्थागत व्यवस्था हेतु समर्पित।', 1, true),
('10000000-0000-0000-0000-000000000002', 'Scholarship Committee Head', 'Scrutiny & Evaluation Committee', 'संवीक्षा एवं मूल्यांकन समिति', 'Supervising multi-tier application verification and student grievance redressal.', 'बहु-स्तरीय आवेदन सत्यापन एवं छात्र शिकायत निवारण का पर्यवेक्षण।', 2, true),
('10000000-0000-0000-0000-000000000003', 'State Coordinator', 'Institutional Alliances', 'संस्थागत समन्वय', 'Coordinating with schools, colleges, and regional verification teams.', 'विद्यालयों, महाविद्यालयों तथा क्षेत्रीय सत्यापन दलों के साथ समन्वय।', 3, true)
ON CONFLICT (id) DO NOTHING;

-- 11. Seed Downloads
INSERT INTO public.downloads (id, title_en, title_hi, category_en, category_hi, format, size_display, version, is_active) VALUES
('DL-01', 'Official Scholarship Application Form (Offline Format)', 'आधिकारिक छात्रवृत्ति आवेदन पत्र (ऑफलाइन प्रारूप)', 'Application Form', 'आवेदन पत्र', 'PDF', '420 KB', '2026.1', true),
('DL-02', 'Scholarship Scheme Rule Book & Guidelines 2026-27', 'छात्रवृत्ति योजना नियम पुस्तिका एवं दिशानिर्देश 2026-27', 'Rules & Guidelines', 'नियम एवं दिशानिर्देश', 'PDF', '1.2 MB', '2026.1', true),
('DL-03', 'Document Verification Checklist & Self-Declaration Format', 'दस्तावेज़ सत्यापन चेकलिस्ट एवं स्व-घोषणा प्रारूप', 'Checklist', 'चेकलिस्ट', 'PDF', '280 KB', '2026.1', true),
('DL-04', 'Institutional Bonafide Certificate Standard Format', 'संस्थान बोनाफाइड प्रमाण पत्र मानक प्रारूप', 'Certificate Template', 'प्रमाण पत्र प्रारूप', 'PDF', '190 KB', '2026.1', true)
ON CONFLICT (id) DO NOTHING;

-- 12. Seed Authentic Realistic Applications with full linked relations
-- Student 1: Pooja Sharma (Scholarship Released)
INSERT INTO public.students (id, full_name, father_name, dob, gender, mobile, email, category, aadhaar_masked, annual_income)
VALUES ('20000000-0000-0000-0000-000000000001', 'Pooja Sharma', 'Ramesh Sharma', '2006-05-14', 'Female', '9826112233', 'pooja.sharma@example.com', 'General', 'XXXX-XXXX-4819', 120000.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.students_addresses (student_id, address_line, district, block, pincode)
VALUES ('20000000-0000-0000-0000-000000000001', 'Ward No. 4, Civil Lines', 'Jabalpur', 'Patan', '482001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.academic_records (student_id, institution_id, institution_name, class_course, prev_examination, prev_percentage)
VALUES ('20000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Govt. Model Higher Secondary School', 'Class 12th (Science)', 'Class 11th', 82.50)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.bank_details (student_id, account_holder_name, bank_name, branch_name, account_number_masked, ifsc_code)
VALUES ('20000000-0000-0000-0000-000000000001', 'Pooja Sharma', 'State Bank of India', 'Main Branch Patan', 'XXXX-XXXX-9281', 'SBIN0001248')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.applications (id, student_id, scheme_id, institution_id, district_id, block_id, status, stage, disbursed_amount, utr_number, submission_date, approval_date, payment_date)
VALUES ('JMF-2026-108234', '20000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'SCHOLARSHIP_RELEASED', 5, 12000.00, 'SBIN00291823901', '2026-08-15', '2026-08-28', '2026-09-02')
ON CONFLICT (id) DO NOTHING;

-- Student 2: Rahul Verma (Under Verification)
INSERT INTO public.students (id, full_name, father_name, dob, gender, mobile, email, category, aadhaar_masked, annual_income)
VALUES ('20000000-0000-0000-0000-000000000002', 'Rahul Verma', 'Kishore Verma', '2004-11-20', 'Male', '9425098765', 'rahul.verma@example.com', 'OBC', 'XXXX-XXXX-1928', 95000.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.applications (id, student_id, scheme_id, institution_id, district_id, block_id, status, stage, submission_date)
VALUES ('JMF-2026-109482', '20000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 'UNDER_VERIFICATION', 2, '2026-09-04')
ON CONFLICT (id) DO NOTHING;

-- Student 3: Ananya Patel (Approved, Ready for Payment)
INSERT INTO public.students (id, full_name, father_name, dob, gender, mobile, email, category, aadhaar_masked, annual_income)
VALUES ('20000000-0000-0000-0000-000000000003', 'Ananya Patel', 'Suresh Patel', '2005-02-18', 'Female', '9893456789', 'ananya.patel@example.com', 'OBC', 'XXXX-XXXX-8290', 140000.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.applications (id, student_id, scheme_id, institution_id, district_id, block_id, status, stage, disbursed_amount, submission_date, approval_date)
VALUES ('JMF-2026-110294', '20000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000005', 'APPROVED', 4, 12000.00, '2026-08-22', '2026-09-08')
ON CONFLICT (id) DO NOTHING;

-- Student 4: Sunil Kumar Ahirwar (Correction Requested)
INSERT INTO public.students (id, full_name, father_name, dob, gender, mobile, email, category, aadhaar_masked, annual_income)
VALUES ('20000000-0000-0000-0000-000000000004', 'Sunil Kumar Ahirwar', 'Gopal Ahirwar', '2007-09-10', 'Male', '9179234567', 'sunil.ahirwar@example.com', 'SC', 'XXXX-XXXX-4829', 60000.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.applications (id, student_id, scheme_id, institution_id, district_id, block_id, status, stage, correction_remarks, submission_date)
VALUES ('JMF-2026-112048', '20000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000007', 'CORRECTION_REQUESTED', 2, 'Uploaded college bonafide certificate is blurry. Please upload a clear stamped copy.', '2026-09-02')
ON CONFLICT (id) DO NOTHING;

-- Student 5: Kavita Gond (Approved)
INSERT INTO public.students (id, full_name, father_name, dob, gender, mobile, email, category, aadhaar_masked, annual_income)
VALUES ('20000000-0000-0000-0000-000000000005', 'Kavita Gond', 'Ramdas Gond', '2006-12-05', 'Female', '9755123489', 'kavita.gond@example.com', 'ST', 'XXXX-XXXX-9481', 48000.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.applications (id, student_id, scheme_id, institution_id, district_id, block_id, status, stage, disbursed_amount, submission_date, approval_date)
VALUES ('JMF-2026-114890', '20000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000008', 'APPROVED', 4, 12000.00, '2026-08-30', '2026-09-11')
ON CONFLICT (id) DO NOTHING;

-- Student 6: Deepak Yadav (Rejected)
INSERT INTO public.students (id, full_name, father_name, dob, gender, mobile, email, category, aadhaar_masked, annual_income)
VALUES ('20000000-0000-0000-0000-000000000006', 'Deepak Yadav', 'Mahesh Yadav', '2003-08-15', 'Male', '8871098765', 'deepak.yadav@example.com', 'OBC', 'XXXX-XXXX-2049', 280000.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.applications (id, student_id, scheme_id, institution_id, district_id, block_id, status, stage, rejection_reason, submission_date)
VALUES ('JMF-2026-116342', '20000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000009', 'REJECTED', 2, 'Incomplete documentation: Family income certificate not matching criteria guidelines.', '2026-08-20')
ON CONFLICT (id) DO NOTHING;

-- 13. Seed Initial Grievance Records
INSERT INTO public.grievances (id, student_name, mobile, application_id, category, description, status) VALUES
('GRV-2026-00482', 'Sunil Kumar Ahirwar', '9179234567', 'JMF-2026-112048', 'Document Re-upload', 'I have uploaded the stamped bonafide certificate from my college principal. Please review.', 'IN_PROGRESS'),
('GRV-2026-00391', 'Pooja Sharma', '9826112233', 'JMF-2026-108234', 'Payment Query', 'Thank you for the scholarship disbursement. Received UTR confirmation.', 'RESOLVED')
ON CONFLICT (id) DO NOTHING;

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function createScholarshipFormPdf() {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // A4 size: 595.28 x 841.89 points
  const width = 595.28;
  const height = 841.89;

  // Colors
  const navy = rgb(11 / 255, 43 / 255, 130 / 255);
  const darkSlate = rgb(15 / 255, 23 / 255, 42 / 255);
  const grayText = rgb(71 / 255, 85 / 255, 105 / 255);
  const borderGray = rgb(203 / 255, 213 / 255, 225 / 255);
  const lightBg = rgb(248 / 255, 250 / 255, 252 / 255);
  const redAlert = rgb(220 / 255, 38 / 255, 38 / 255);
  const greenText = rgb(22 / 255, 163 / 255, 74 / 255);

  // ==========================================
  // PAGE 1: Personal & Academic Information
  // ==========================================
  const page1 = pdfDoc.addPage([width, height]);

  // Outer Border
  page1.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: navy,
    borderWidth: 1.5,
  });

  // Top Header Banner
  page1.drawRectangle({
    x: 22,
    y: height - 90,
    width: width - 44,
    height: 68,
    color: navy,
  });

  page1.drawText('JANKALYAN MANAVADHIKAR FOUNDATION', {
    x: 35,
    y: height - 44,
    size: 15,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page1.drawText('Section 8 Non-Profit Organization | Govt. of India Ministry of Corporate Affairs', {
    x: 35,
    y: height - 58,
    size: 8.5,
    font: fontRegular,
    color: rgb(254 / 255, 240 / 255, 138 / 255), // Yellow
  });

  page1.drawText('CIN: U85500MP2024NPL069532  |  Income Tax 80G URN: AAGCJ3046CF20241  |  12A URN: AAGCJ3046CE20231', {
    x: 35,
    y: height - 70,
    size: 7.2,
    font: fontRegular,
    color: rgb(224 / 255, 231 / 255, 255 / 255),
  });

  page1.drawText('Registered Office: Ward No. 30, Shri Ram College Road, Dixit Colony, Jabalpur (M.P.) - 482002', {
    x: 35,
    y: height - 82,
    size: 7,
    font: fontRegular,
    color: rgb(203 / 255, 213 / 255, 225 / 255),
  });

  // Title Banner
  page1.drawRectangle({
    x: 22,
    y: height - 116,
    width: width - 44,
    height: 24,
    color: rgb(254 / 255, 242 / 255, 242 / 255),
    borderColor: rgb(254 / 255, 202 / 255, 202 / 255),
    borderWidth: 1,
  });

  page1.drawText('NATIONAL SCHOLARSHIP YOJNA 2026-27 : OFFICIAL APPLICATION FORM', {
    x: 80,
    y: height - 107,
    size: 9.5,
    font: fontBold,
    color: redAlert,
  });

  // Photo Box (Top Right)
  const photoX = width - 130;
  const photoY = height - 225;
  page1.drawRectangle({
    x: photoX,
    y: photoY,
    width: 95,
    height: 98,
    borderColor: borderGray,
    borderWidth: 1,
    color: lightBg,
  });
  page1.drawText('AFFIX RECENT', { x: photoX + 15, y: photoY + 58, size: 7.5, font: fontBold, color: grayText });
  page1.drawText('PASSPORT PHOTO', { x: photoX + 8, y: photoY + 46, size: 7.5, font: fontBold, color: grayText });
  page1.drawText('(Self-Attested)', { x: photoX + 20, y: photoY + 34, size: 6.5, font: fontRegular, color: grayText });

  // Application Tracking Reference Meta
  let currY = height - 135;
  page1.drawText('Application Form No. : ________________________', { x: 35, y: currY, size: 8.5, font: fontBold, color: darkSlate });
  page1.drawText('Date of Issue: ____/____/2026', { x: 260, y: currY, size: 8.5, font: fontRegular, color: darkSlate });
  currY -= 16;
  page1.drawText('Coordinator / Center Code: ____________________', { x: 35, y: currY, size: 8.5, font: fontRegular, color: darkSlate });
  page1.drawText('Application Fee: Rs. 1.00 (Paid)', { x: 260, y: currY, size: 8.5, font: fontBold, color: greenText });

  // SECTION 1: APPLICANT PERSONAL DETAILS
  currY -= 20;
  page1.drawRectangle({ x: 30, y: currY - 4, width: width - 60, height: 16, color: rgb(239 / 255, 246 / 255, 255 / 255) });
  page1.drawText('SECTION 1: APPLICANT PERSONAL INFORMATION & RESIDENCE', { x: 35, y: currY, size: 8.5, font: fontBold, color: navy });

  const renderFieldRow = (label1, label2, y) => {
    page1.drawText(label1, { x: 35, y, size: 8, font: fontBold, color: darkSlate });
    page1.drawLine({ start: { x: 130, y: y - 2 }, end: { x: 290, y: y - 2 }, thickness: 0.8, color: borderGray });
    if (label2) {
      page1.drawText(label2, { x: 310, y, size: 8, font: fontBold, color: darkSlate });
      page1.drawLine({ start: { x: 410, y: y - 2 }, end: { x: width - 35, y: y - 2 }, thickness: 0.8, color: borderGray });
    }
  };

  currY -= 18;
  renderFieldRow('1. Full Name:', '2. Date of Birth:', currY);
  currY -= 17;
  renderFieldRow("3. Father's Name:", '4. Gender (M/F/O):', currY);
  currY -= 17;
  renderFieldRow("5. Mother's Name:", '6. Category (GEN/OBC/SC/ST):', currY);
  currY -= 17;
  renderFieldRow('7. Mobile No.:', '8. Alternate Mobile:', currY);
  currY -= 17;
  renderFieldRow('9. Email ID:', '10. Annual Family Income:', currY);
  currY -= 17;
  renderFieldRow('11. Aadhaar Number:', '12. Samagra ID (if MP):', currY);
  currY -= 17;
  page1.drawText('13. Residential Address:', { x: 35, y: currY, size: 8, font: fontBold, color: darkSlate });
  page1.drawLine({ start: { x: 140, y: currY - 2 }, end: { x: width - 35, y: currY - 2 }, thickness: 0.8, color: borderGray });
  currY -= 16;
  renderFieldRow('    Village / Ward:', '    Block / Tehsil:', currY);
  currY -= 16;
  renderFieldRow('    District:', '    State & PIN Code:', currY);

  // SECTION 2: ACADEMIC DETAILS & SCHOLARSHIP SLAB
  currY -= 22;
  page1.drawRectangle({ x: 30, y: currY - 4, width: width - 60, height: 16, color: rgb(239 / 255, 246 / 255, 255 / 255) });
  page1.drawText('SECTION 2: CURRENT ACADEMIC ENROLLMENT & SCHOLARSHIP SLAB', { x: 35, y: currY, size: 8.5, font: fontBold, color: navy });

  currY -= 18;
  page1.drawText('14. School / College / Institute Name:', { x: 35, y: currY, size: 8, font: fontBold, color: darkSlate });
  page1.drawLine({ start: { x: 195, y: currY - 2 }, end: { x: width - 35, y: currY - 2 }, thickness: 0.8, color: borderGray });

  currY -= 17;
  renderFieldRow('15. Institute Code / AISHE:', '16. Board / University:', currY);
  currY -= 17;
  renderFieldRow('17. Enrolled Class / Course:', '18. Current Roll / Scholar No.:', currY);
  currY -= 17;
  renderFieldRow('19. Previous Exam Passed:', '20. Prev. Marks & Percentage:', currY);

  currY -= 20;
  page1.drawText('21. Select Entitled Scholarship Slab (as per enrolled course - Official Poster):', { x: 35, y: currY, size: 8, font: fontBold, color: darkSlate });

  // Slab Table
  currY -= 16;
  const slabs = [
    ['[  ] Class 5th to 7th', 'Rs. 4,000/- per year', '[  ] Diploma / Polytechnic / ITI', 'Rs. 14,000/- per year'],
    ['[  ] Class 8th to 10th', 'Rs. 8,000/- per year', '[  ] Graduation (Degree / UG)', 'Rs. 16,000/- per year'],
    ['[  ] Class 11th & 12th', 'Rs. 12,000/- per year', '[  ] Post Graduation (Master / PG)', 'Rs. 22,000/- per year'],
  ];

  slabs.forEach(row => {
    page1.drawRectangle({ x: 35, y: currY - 2, width: width - 70, height: 14, color: lightBg, borderColor: borderGray, borderWidth: 0.5 });
    page1.drawText(row[0], { x: 42, y: currY + 2, size: 7.5, font: fontBold, color: navy });
    page1.drawText(row[1], { x: 165, y: currY + 2, size: 7.5, font: fontRegular, color: redAlert });
    page1.drawText(row[2], { x: 295, y: currY + 2, size: 7.5, font: fontBold, color: navy });
    page1.drawText(row[3], { x: 440, y: currY + 2, size: 7.5, font: fontRegular, color: redAlert });
    currY -= 16;
  });

  // Bottom Notice on Page 1
  page1.drawText('Note: Continued on Page 2 for Bank Details, Documents Checklist & Institutional Attestation.', {
    x: 100,
    y: 28,
    size: 7.5,
    font: fontOblique,
    color: grayText,
  });
  page1.drawText('Page 1 of 2', { x: width - 75, y: 28, size: 7.5, font: fontBold, color: navy });

  // ==========================================
  // PAGE 2: Bank Details, Checklist, Declarations
  // ==========================================
  const page2 = pdfDoc.addPage([width, height]);

  // Outer Border
  page2.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: navy,
    borderWidth: 1.5,
  });

  // Page 2 Compact Header
  page2.drawRectangle({
    x: 22,
    y: height - 60,
    width: width - 44,
    height: 38,
    color: navy,
  });
  page2.drawText('JANKALYAN MANAVADHIKAR FOUNDATION - SCHOLARSHIP YOJNA 2026-27', {
    x: 35,
    y: height - 42,
    size: 11,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  page2.drawText('DIRECT BENEFIT TRANSFER (DBT) DISBURSAL & INSTITUTIONAL VERIFICATION FORM', {
    x: 35,
    y: height - 54,
    size: 7.5,
    font: fontRegular,
    color: rgb(254 / 255, 240 / 255, 138 / 255),
  });

  let p2Y = height - 80;

  // SECTION 3: BANK DETAILS FOR DBT
  page2.drawRectangle({ x: 30, y: p2Y - 4, width: width - 60, height: 16, color: rgb(239 / 255, 246 / 255, 255 / 255) });
  page2.drawText('SECTION 3: STUDENT BANK ACCOUNT DETAILS FOR DIRECT BENEFIT DISBURSAL (DBT)', { x: 35, y: p2Y, size: 8.5, font: fontBold, color: navy });

  p2Y -= 18;
  page2.drawText('22. Account Holder Name (Must be in Student or Joint with Parent):', { x: 35, y: p2Y, size: 8, font: fontBold, color: darkSlate });
  page2.drawLine({ start: { x: 295, y: p2Y - 2 }, end: { x: width - 35, y: p2Y - 2 }, thickness: 0.8, color: borderGray });

  p2Y -= 17;
  page2.drawText('23. Bank Name:', { x: 35, y: p2Y, size: 8, font: fontBold, color: darkSlate });
  page2.drawLine({ start: { x: 105, y: p2Y - 2 }, end: { x: 280, y: p2Y - 2 }, thickness: 0.8, color: borderGray });
  page2.drawText('24. Branch & City:', { x: 300, y: p2Y, size: 8, font: fontBold, color: darkSlate });
  page2.drawLine({ start: { x: 380, y: p2Y - 2 }, end: { x: width - 35, y: p2Y - 2 }, thickness: 0.8, color: borderGray });

  p2Y -= 17;
  page2.drawText('25. Account Number:', { x: 35, y: p2Y, size: 8, font: fontBold, color: darkSlate });
  page2.drawLine({ start: { x: 125, y: p2Y - 2 }, end: { x: 280, y: p2Y - 2 }, thickness: 0.8, color: borderGray });
  page2.drawText('26. Bank IFSC Code:', { x: 300, y: p2Y, size: 8, font: fontBold, color: darkSlate });
  page2.drawLine({ start: { x: 395, y: p2Y - 2 }, end: { x: width - 35, y: p2Y - 2 }, thickness: 0.8, color: borderGray });

  // SECTION 4: MANDATORY DOCUMENTS CHECKLIST
  p2Y -= 24;
  page2.drawRectangle({ x: 30, y: p2Y - 4, width: width - 60, height: 16, color: rgb(239 / 255, 246 / 255, 255 / 255) });
  page2.drawText('SECTION 4: MANDATORY ATTACHED DOCUMENTS CHECKLIST', { x: 35, y: p2Y, size: 8.5, font: fontBold, color: navy });

  p2Y -= 16;
  const docs = [
    ['[  ] 1. Recent Passport Size Photograph (affixed)', '[  ] 4. Institutional Bonafide / Study Certificate'],
    ['[  ] 2. Photocopy of Student Aadhaar Card', '[  ] 5. Student Bank Account Passbook / Cancelled Cheque'],
    ['[  ] 3. Previous Year Marksheet (Self-Attested)', '[  ] 6. Income Certificate / Samagra ID / Caste Certificate'],
  ];

  docs.forEach(row => {
    page2.drawText(row[0], { x: 40, y: p2Y, size: 7.5, font: fontRegular, color: darkSlate });
    page2.drawText(row[1], { x: 290, y: p2Y, size: 7.5, font: fontRegular, color: darkSlate });
    p2Y -= 14;
  });

  // SECTION 5: APPLICANT & GUARDIAN UNDERTAKING
  p2Y -= 12;
  page2.drawRectangle({ x: 30, y: p2Y - 4, width: width - 60, height: 16, color: rgb(239 / 255, 246 / 255, 255 / 255) });
  page2.drawText('SECTION 5: APPLICANT & PARENT UNDERTAKING AND DECLARATION', { x: 35, y: p2Y, size: 8.5, font: fontBold, color: navy });

  p2Y -= 14;
  const declarationText = 'I hereby solemnly declare that all particulars entered above are true, accurate and complete to the best of my knowledge. I am enrolled as a regular student in the declared academic institution. I understand that the non-refundable registration & scrutiny fee of Rs. 1.00/- is paid towards administrative verification. If any document is found falsified, my scholarship grant will be immediately cancelled without notice.';
  page2.drawText(declarationText, {
    x: 35,
    y: p2Y,
    size: 6.8,
    font: fontRegular,
    color: grayText,
    maxWidth: width - 70,
    lineHeight: 9.5,
  });

  p2Y -= 45;
  page2.drawText('____________________________________', { x: 45, y: p2Y, size: 8, font: fontRegular, color: borderGray });
  page2.drawText('____________________________________', { x: width - 215, y: p2Y, size: 8, font: fontRegular, color: borderGray });
  p2Y -= 12;
  page2.drawText('Signature / Thumb Impression of Student', { x: 50, y: p2Y, size: 7.5, font: fontBold, color: darkSlate });
  page2.drawText('Signature of Father / Mother / Guardian', { x: width - 210, y: p2Y, size: 7.5, font: fontBold, color: darkSlate });

  // SECTION 6: INSTITUTIONAL BONAFIDE CERTIFICATION
  p2Y -= 20;
  page2.drawRectangle({ x: 30, y: p2Y - 4, width: width - 60, height: 16, color: rgb(254 / 255, 242 / 255, 242 / 255), borderColor: rgb(254 / 255, 202 / 255, 202 / 255), borderWidth: 1 });
  page2.drawText('SECTION 6: INSTITUTIONAL HEAD / PRINCIPAL ATTESTATION & SEAL', { x: 35, y: p2Y, size: 8.5, font: fontBold, color: redAlert });

  p2Y -= 14;
  const instCertText = 'Certified that the applicant Shri/Kumari __________________________________________________ is a bonafide student of this registered institution in Class/Course ____________________ for Session 2026-27. His/her character and attendance are satisfactory. Recommended for Jankalyan Scholarship.';
  page2.drawText(instCertText, {
    x: 35,
    y: p2Y,
    size: 7.2,
    font: fontRegular,
    color: darkSlate,
    maxWidth: width - 70,
    lineHeight: 11,
  });

  p2Y -= 40;
  page2.drawText('Date: ____/____/2026', { x: 45, y: p2Y, size: 8, font: fontRegular, color: darkSlate });
  page2.drawText('Place: ____________________', { x: 160, y: p2Y, size: 8, font: fontRegular, color: darkSlate });
  page2.drawText('Signature of Principal / Nodal Officer with Official Seal', { x: width - 235, y: p2Y, size: 7.5, font: fontBold, color: navy });

  // SECTION 7: OFFICE & DISTRICT COORDINATOR USE ONLY
  p2Y -= 22;
  page2.drawRectangle({ x: 30, y: p2Y - 4, width: width - 60, height: 16, color: rgb(240 / 255, 253 / 255, 244 / 255), borderColor: rgb(187 / 255, 247 / 255, 208 / 255), borderWidth: 1 });
  page2.drawText('SECTION 7: DISTRICT NODAL OFFICE / COORDINATOR ENDORSEMENT', { x: 35, y: p2Y, size: 8.5, font: fontBold, color: greenText });

  p2Y -= 15;
  page2.drawText('Application Recd. Date: ____/____/2026  |  Fee Status: [X] Paid Rs. 1.00  |  Scrutiny: [  ] Verified & Approved', {
    x: 35,
    y: p2Y,
    size: 7.5,
    font: fontRegular,
    color: darkSlate,
  });

  p2Y -= 15;
  page2.drawText('Coordinator Name: __________________________  ID/Code: __________________  Signature: __________________', {
    x: 35,
    y: p2Y,
    size: 7.5,
    font: fontRegular,
    color: darkSlate,
  });

  // Footer Contacts
  page2.drawRectangle({ x: 22, y: 22, width: width - 44, height: 26, color: lightBg, borderColor: borderGray, borderWidth: 0.5 });
  page2.drawText('Official Portal: www.jankalyanmanavadhikarscholarship.com  |  Helpline: 8871557054, 0761-4500054  |  Email: info@jankalyanmanavadhikarscholarship.com', {
    x: 35,
    y: 32,
    size: 7,
    font: fontRegular,
    color: darkSlate,
  });
  page2.drawText('Page 2 of 2', { x: width - 75, y: 32, size: 7.5, font: fontBold, color: navy });

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  const outPath = path.resolve('public/downloads/scholarship_application_form_2026_27.pdf');
  fs.writeFileSync(outPath, pdfBytes);
  console.log('Saved PDF to', outPath, 'Bytes:', pdfBytes.length);
}

createScholarshipFormPdf().catch(console.error);

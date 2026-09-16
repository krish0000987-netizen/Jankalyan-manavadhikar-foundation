/**
 * Vercel Serverless Function: Create Razorpay Order
 * Generates an official Razorpay Order ID for Scholarship Registration Fee (₹ 211.30)
 */
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { amountInRupees = 211.30, applicationId = 'NEW_APP', studentName = '' } = req.body || {};
    
    // Live Credentials
    const keyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_live_TceflpS8ncUJPO';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.VITE_RAZORPAY_KEY_SECRET || 'Q00wCUJHNbd3PEl2Yx6dZ2du';

    // Amount in Paise (₹ 211.30 = 21130 paise)
    const amountInPaise = Math.round(Number(amountInRupees) * 100);
    const receipt = `rcpt_${String(applicationId).replace(/[^a-zA-Z0-9_]/g, '')}_${Date.now().toString(36)}`.slice(0, 40);

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        notes: {
          application_id: String(applicationId),
          student_name: String(studentName),
          purpose: 'Scholarship Registration Fee ₹211.30'
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Razorpay Orders API error:', data);
      return res.status(response.status).json({ 
        error: data.error?.description || 'Failed to create Razorpay live order' 
      });
    }

    return res.status(200).json({
      success: true,
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: keyId
    });
  } catch (err) {
    console.error('Create Razorpay order error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}

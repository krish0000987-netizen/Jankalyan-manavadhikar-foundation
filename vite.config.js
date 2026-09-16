import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      {
        name: 'razorpay-order-dev-api',
        configureServer(server) {
          server.middlewares.use('/api/create-razorpay-order', async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                try {
                  const parsed = body ? JSON.parse(body) : {};
                  const keyId = env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TceflpS8ncUJPO';
                  const keySecret = env.RAZORPAY_KEY_SECRET || env.VITE_RAZORPAY_KEY_SECRET || 'Q00wCUJHNbd3PEl2Yx6dZ2du';
                  const amountInPaise = Math.round((parsed.amountInRupees || 211.30) * 100);
                  const receipt = `rcpt_${String(parsed.applicationId || 'NEW').replace(/[^a-zA-Z0-9_]/g, '')}_${Date.now().toString(36)}`.slice(0, 40);

                  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
                  const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
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
                        application_id: String(parsed.applicationId || 'NEW'),
                        purpose: 'Scholarship Registration Fee ₹211.30'
                      }
                    })
                  });
                  const data = await rzpRes.json();
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = rzpRes.status;
                  res.end(JSON.stringify({ 
                    success: rzpRes.ok, 
                    orderId: data.id, 
                    amount: data.amount, 
                    currency: data.currency, 
                    keyId 
                  }));
                } catch (e) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: e.message }));
                }
              });
            } else {
              res.statusCode = 405;
              res.end('Method Not Allowed');
            }
          });
        }
      }
    ]
  };
});

/**
 * Jankalyan Manavadhikar Foundation - Razorpay Payment Service
 * Handles scholarship application registration fee payments via Razorpay Gateway (Live Production & Test).
 */

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';
const DEFAULT_KEY_ID = 'rzp_live_TceflpS8ncUJPO';

let scriptLoadingPromise = null;

export const loadRazorpayScript = () => {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) {
    return Promise.resolve(true);
  }
  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      console.warn('Razorpay SDK failed to load from CDN.');
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return scriptLoadingPromise;
};

/**
 * Checks if Razorpay is currently operating in Test Mode
 */
export const isRazorpayTestMode = () => {
  const mode = (import.meta.env.VITE_RAZORPAY_MODE || 'live').toLowerCase();
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID || DEFAULT_KEY_ID;
  return mode === 'test' || key.startsWith('rzp_test_');
};

/**
 * Initiate Razorpay payment for scholarship registration fee (e.g. ₹ 1.00)
 * @param {Object} params
 * @param {number} params.amountInRupees - Amount in INR (e.g. 1.00)
 * @param {Object} params.student - Student info { fullName, email, mobile, applicationId }
 * @param {Function} params.onSuccess - Callback receiving { paymentId, orderId, signature, amount, date }
 * @param {Function} params.onFailure - Callback receiving error object
 * @param {Function} params.onDismiss - Callback when checkout is closed
 */
export const initiateScholarshipFeePayment = async ({
  amountInRupees = 1.00,
  student = {},
  onSuccess,
  onFailure,
  onDismiss
}) => {
  const isLoaded = await loadRazorpayScript();
  const configuredKey = import.meta.env.VITE_RAZORPAY_KEY_ID || DEFAULT_KEY_ID;
  const isTest = isRazorpayTestMode();
  const amountInPaise = Math.round(amountInRupees * 100); // 100 paise = ₹ 1.00

  // If SDK failed to load
  if (!isLoaded || !window.Razorpay) {
    if (isTest) {
      openRazorpayTestSandboxModal({
        amountInRupees,
        student,
        onSuccess,
        onFailure,
        onDismiss
      });
      return;
    } else {
      if (onFailure) {
        onFailure(new Error('Razorpay payment gateway failed to load. Please check your internet connection and try again.'));
      }
      return;
    }
  }

  // Create official Razorpay Order ID
  let orderId = null;
  try {
    const orderRes = await fetch('/api/create-razorpay-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amountInRupees,
        applicationId: student.applicationId || student.id || 'NEW_APP',
        studentName: student.fullName || student.name || 'Scholarship Applicant'
      })
    });
    if (orderRes.ok) {
      const orderData = await orderRes.json();
      if (orderData.orderId) {
        orderId = orderData.orderId;
      }
    }
  } catch (err) {
    console.warn('Razorpay order creation call note:', err);
  }

  try {
    const options = {
      key: configuredKey,
      amount: amountInPaise,
      currency: 'INR',
      name: 'Jankalyan Manavadhikar Foundation',
      description: isTest
        ? 'Scholarship Application Fee (Session 2026-27) [TEST MODE]'
        : 'Scholarship Registration Fee (Session 2026-27)',
      image: 'https://jankalyanmanavadhikar.in/logo.png',
      ...(orderId ? { order_id: orderId } : {}),
      handler: function (response) {
        if (response && response.razorpay_payment_id) {
          onSuccess && onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id || orderId || null,
            signature: response.razorpay_signature || null,
            amount: amountInRupees,
            method: isTest ? 'RAZORPAY_TEST' : 'RAZORPAY_LIVE',
            date: new Date().toISOString()
          });
        } else {
          onFailure && onFailure(new Error('Payment was not completed or transaction ID was not returned by gateway.'));
        }
      },
      prefill: {
        name: student.fullName || student.name || 'Scholarship Applicant',
        email: student.email || 'applicant@jankalyan.org',
        contact: (student.mobile || '').replace(/[^0-9]/g, '') || '9876543210'
      },
      notes: {
        application_id: student.applicationId || student.id || 'NEW_APPLICATION',
        purpose: `Scholarship Registration Fee ₹${amountInRupees}`,
        environment: isTest ? 'test' : 'live'
      },
      theme: {
        color: '#1E40AF'
      },
      modal: {
        ondismiss: function () {
          if (onDismiss) onDismiss();
        }
      }
    };

    const rzpInstance = new window.Razorpay(options);
    rzpInstance.on('payment.failed', function (response) {
      console.error('Razorpay payment failed:', response.error);
      if (onFailure) {
        onFailure(new Error(response.error?.description || 'Transaction declined by issuing bank/gateway.'));
      }
    });
    rzpInstance.open();
    return;
  } catch (err) {
    console.error('Razorpay gateway launch failed:', err);
    if (!isTest) {
      if (onFailure) {
        onFailure(new Error('Payment gateway could not be launched: ' + (err.message || 'Unknown error')));
      }
      return;
    }

    // Only in test mode can we fallback to sandbox modal
    openRazorpayTestSandboxModal({
      amountInRupees,
      student,
      onSuccess,
      onFailure,
      onDismiss
    });
  }
};

/**
 * Interactive Razorpay Test Sandbox Modal
 * Provides a realistic test payment environment with UPI, Cards, Net Banking, and Bank Simulation.
 */
function openRazorpayTestSandboxModal({ amountInRupees, student, onSuccess, onFailure, onDismiss }) {
  const existing = document.getElementById('rzp-simulated-modal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'rzp-simulated-modal';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: #FFFFFF;
    border-radius: 16px;
    width: 92%;
    max-width: 460px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    overflow: hidden;
    animation: rzpFadeIn 0.22s ease-out;
  `;

  modal.innerHTML = `
    <style>
      @keyframes rzpFadeIn {
        from { opacity: 0; transform: translateY(12px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .rzp-option-test:hover { border-color: #2563EB !important; background: #EFF6FF !important; }
      .rzp-btn-test-pay:hover { background: #1D4ED8 !important; }
      .rzp-btn-test-fail:hover { background: #FEE2E2 !important; color: #DC2626 !important; }
    </style>

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%); color: #FFFFFF; padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.15rem; color: #FEF08A;">
          ₹
        </div>
        <div>
          <div style="font-weight: 800; font-size: 0.95rem; letter-spacing: 0.02em; display: flex; align-items: center; gap: 0.45rem;">
            <span>Jankalyan Foundation</span>
            <span style="background: #FEF08A; color: #854D0E; font-size: 0.65rem; font-weight: 900; padding: 1px 6px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em;">TEST MODE</span>
          </div>
          <div style="font-size: 0.75rem; color: #BFDBFE;">Razorpay Secured Test Gateway</div>
        </div>
      </div>
      <button id="rzp-close-btn" style="background: none; border: none; color: #FFFFFF; font-size: 1.5rem; cursor: pointer; padding: 0 0.25rem; line-height: 1; opacity: 0.85;">×</button>
    </div>

    <!-- Test Environment Banner -->
    <div style="background: #FEF3C7; border-bottom: 1px solid #FDE68A; padding: 0.65rem 1.5rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem; color: #92400E;">
      <span style="font-size: 1rem;">🧪</span>
      <div>
        <strong>Razorpay Test Mode Active:</strong> No real bank charges will be incurred.
      </div>
    </div>

    <!-- Order Details Banner -->
    <div style="background: #F8FAFC; padding: 1rem 1.5rem; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.72rem; color: #64748B; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em;">Scholarship Registration Fee</div>
        <div style="font-size: 0.875rem; font-weight: 700; color: #0F172A;">${student.fullName || student.name || 'Scholarship Applicant'}</div>
        <div style="font-size: 0.72rem; color: #64748B;">App ID: ${student.applicationId || student.id || 'NEW'}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 1.4rem; font-weight: 900; color: #1E40AF;">₹ ${amountInRupees.toFixed(2)}</div>
        <div style="font-size: 0.7rem; color: #16A34A; font-weight: 800;">Zero Fee Added</div>
      </div>
    </div>

    <!-- Body / Payment Methods -->
    <div style="padding: 1.25rem 1.5rem;">
      <div style="font-size: 0.75rem; font-weight: 800; color: #475569; margin-bottom: 0.65rem; text-transform: uppercase; letter-spacing: 0.04em;">
        Select Test Payment Method
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.25rem;">
        
        <!-- UPI Option -->
        <label class="rzp-option-test" style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border: 1.5px solid #2563EB; background: #EFF6FF; border-radius: 10px; cursor: pointer; transition: all 0.15s ease;">
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <input type="radio" name="rzp_test_method" value="upi" checked style="accent-color: #2563EB;">
            <div>
              <div style="font-weight: 800; font-size: 0.85rem; color: #1E293B;">UPI (Google Pay / PhonePe / Paytm)</div>
              <div style="font-size: 0.72rem; color: #2563EB; font-weight: 600;">Test VPA: success@razorpay</div>
            </div>
          </div>
          <span style="font-size: 0.68rem; font-weight: 800; background: #DCFCE7; color: #166534; padding: 2px 6px; border-radius: 4px;">FAST TEST</span>
        </label>

        <!-- Card Option -->
        <label class="rzp-option-test" style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border: 1.5px solid #E2E8F0; border-radius: 10px; cursor: pointer; transition: all 0.15s ease;">
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <input type="radio" name="rzp_test_method" value="card" style="accent-color: #2563EB;">
            <div>
              <div style="font-weight: 700; font-size: 0.85rem; color: #1E293B;">Debit / Credit Card</div>
              <div style="font-size: 0.72rem; color: #64748B;">Test Card: 4111 •••• •••• 1111 (OTP: 123456)</div>
            </div>
          </div>
          <span style="font-size: 0.68rem; font-weight: 700; color: #64748B;">VISA / RUPAY</span>
        </label>

        <!-- Net Banking Option -->
        <label class="rzp-option-test" style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border: 1.5px solid #E2E8F0; border-radius: 10px; cursor: pointer; transition: all 0.15s ease;">
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <input type="radio" name="rzp_test_method" value="netbanking" style="accent-color: #2563EB;">
            <div>
              <div style="font-weight: 700; font-size: 0.85rem; color: #1E293B;">Net Banking</div>
              <div style="font-size: 0.72rem; color: #64748B;">SBI, HDFC, ICICI, PNB (Simulated Success)</div>
            </div>
          </div>
          <span style="font-size: 0.68rem; font-weight: 700; color: #64748B;">ALL BANKS</span>
        </label>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <button id="rzp-confirm-pay" class="rzp-btn-test-pay" style="width: 100%; padding: 0.85rem; background: #2563EB; color: #FFFFFF; border: none; border-radius: 10px; font-weight: 800; font-size: 0.95rem; cursor: pointer; transition: background 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
          <span>Pay ₹ ${amountInRupees.toFixed(2)} (Simulate Success)</span>
          <span>✓</span>
        </button>

        <button id="rzp-simulate-fail" class="rzp-btn-test-fail" style="width: 100%; padding: 0.6rem; background: transparent; color: #94A3B8; border: 1px dashed #CBD5E1; border-radius: 8px; font-weight: 700; font-size: 0.78rem; cursor: pointer; transition: all 0.2s ease;">
          Simulate Bank Failure / User Cancelled
        </button>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 1rem; font-size: 0.7rem; color: #94A3B8; display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
        <span>🔒</span>
        <span>Secured by <strong style="color: #0284C7;">Razorpay</strong> Test Gateway</span>
      </div>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Close / Dismiss handler
  const closeBtn = document.getElementById('rzp-close-btn');
  closeBtn.onclick = () => {
    overlay.remove();
    if (onDismiss) onDismiss();
  };

  overlay.onclick = (e) => {
    if (e.target === overlay) {
      overlay.remove();
      if (onDismiss) onDismiss();
    }
  };

  // Simulate Failure handler
  const failBtn = document.getElementById('rzp-simulate-fail');
  failBtn.onclick = () => {
    overlay.remove();
    if (onFailure) {
      onFailure(new Error('Test Simulation: Payment declined by issuing bank (BAD_REQUEST_ERROR)'));
    }
  };

  // Confirm Successful Test Pay handler
  const payBtn = document.getElementById('rzp-confirm-pay');
  payBtn.onclick = () => {
    payBtn.disabled = true;
    payBtn.style.opacity = '0.8';
    payBtn.innerHTML = 'Simulating Razorpay Payment...';

    setTimeout(() => {
      overlay.remove();
      const generatedPaymentId = `pay_test_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 6)}`;
      const generatedOrderId = `order_test_${Date.now().toString(36)}`;
      
      if (onSuccess) {
        onSuccess({
          paymentId: generatedPaymentId,
          orderId: generatedOrderId,
          signature: `sig_test_${Date.now().toString(36)}`,
          amount: amountInRupees,
          method: 'RAZORPAY_TEST',
          date: new Date().toISOString()
        });
      }
    }, 450);
  };
}

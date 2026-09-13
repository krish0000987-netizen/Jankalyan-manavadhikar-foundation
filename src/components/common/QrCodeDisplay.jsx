import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export const QrCodeDisplay = ({ 
  value, 
  size = 120, 
  level = 'M',
  includeMargin = true,
  className = '' 
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: includeMargin ? 2 : 0,
        errorCorrectionLevel: level,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF'
        }
      }, (err) => {
        if (err) console.error('QR code render error:', err);
      });
    }
  }, [value, size, level, includeMargin]);

  return (
    <div className={`qr-display-container ${className}`} style={{ display: 'inline-flex', padding: '4px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
      <canvas ref={canvasRef} style={{ width: size, height: size, display: 'block' }} />
    </div>
  );
};

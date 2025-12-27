'use client';

import { useState } from 'react';

export default function DonateButton({ campaignName }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          price: '100', 
          campaignName: campaignName 
        }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        const scriptContent = data.checkoutFormContent + '<div id="iyzipay-checkout-form" class="responsive"></div>';
        
        // Popup engelleyiciye takılmamak için mevcut sayfayı ödeme formuna çeviriyoruz
        document.open();
        document.write(scriptContent);
        document.close();
        
      } else {
        alert('Ödeme formu hatası: ' + (data.errorMessage || 'Bilinmiyor'));
      }
    } catch (error) {
      console.error(error);
      alert('Bir hata oluştu.');
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handlePayment} 
      disabled={loading}
      className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition shadow-lg text-lg"
    >
      {loading ? 'Ödeme Başlatılıyor...' : 'Katkıda Bulun (100 TL)'}
    </button>
  );
}
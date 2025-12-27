'use client';

import { useEffect, useState, use } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CampaignDetail({ params }) {
  const { slug } = use(params);

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  // Varsayılan tutar 100 TL
  const [amount, setAmount] = useState(100); 

  useEffect(() => {
    async function getData() {
      // 1. Kampanya verisini çek
      const { data: campData } = await supabase
        .from('campaigns')
        .select('*')
        .eq('slug', slug)
        .single();
      
      setCampaign(campData);

      // 2. Kullanıcı giriş yapmış mı kontrol et
      const { data: { user: userData } } = await supabase.auth.getUser();
      setUser(userData);
    }
    
    if (slug) { getData(); }
  }, [slug]);

  const handlePayment = async () => {
    if(!campaign) return;
    if(amount <= 0) { alert("Lütfen geçerli bir tutar giriniz."); return; }

    setLoading(true);

    // E-posta Mantığı: Kullanıcı varsa onu al, yoksa 'misafir' ata.
    const emailToSend = user ? user.email : 'misafir@gizli.com';

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: amount,
          campaignName: campaign.title,
          userEmail: emailToSend // <-- Otomatik belirlenen mail
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        if (data.htmlContent) {
            document.write(data.htmlContent);
        } else if (data.paymentPageUrl) {
            window.location.href = data.paymentPageUrl;
        }
      } else {
        alert('Ödeme hatası: ' + data.errorMessage);
      }
    } catch (err) {
      console.error(err);
      alert('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (!campaign) return <div className="p-10 text-center text-black">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Üst Renk Çubuğu */}
        <div className={`h-4 ${campaign.color || 'bg-blue-500'} w-full`}></div>

        <div className="p-8">
          <div className="flex justify-between items-start">
             <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full uppercase font-semibold">
                  Aktif Kampanya
                </span>
             </div>
             <div className="text-6xl">{campaign.logo}</div>
          </div>

          <p className="mt-6 text-gray-700 text-lg leading-relaxed">
            {campaign.description}
          </p>

          {/* --- ÖDEME ALANI --- */}
          <div className="mt-10 p-8 bg-white border-2 border-gray-100 rounded-2xl shadow-sm">
            
            <h3 className="text-2xl font-bold text-black mb-6 text-center">Destek Ol</h3>

            {/* TUTAR GİRİŞİ (SİYAH YAZI İLE) */}
            <div className="mb-6">
                <label className="block text-gray-800 text-sm font-bold mb-2">
                    Bağışlamak İstediğiniz Tutar
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    // BURASI ÖNEMLİ: text-black ve bg-white eklendi
                    className="w-full p-4 border-2 border-gray-300 rounded-xl text-3xl font-bold text-black bg-white focus:border-black focus:ring-0 outline-none transition text-center"
                  />
                  <span className="absolute right-6 top-5 text-gray-500 font-bold text-xl">TL</span>
                </div>
            </div>

            {/* BİLGİLENDİRME METNİ */}
            <div className="mb-6 text-center">
                {user ? (
                    <div className="inline-block bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800 font-medium">
                           👤 <b>{user.email}</b> olarak bağış yapıyorsunuz.
                        </p>
                    </div>
                ) : (
                    <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg">
                        <p className="text-sm text-gray-600 font-medium">
                           🕵️ <b>Misafir</b> olarak isimsiz bağış yapıyorsunuz.
                        </p>
                    </div>
                )}
            </div>

            {/* ÖDEME BUTONU */}
            <button
              onClick={handlePayment}
              disabled={loading || amount <= 0}
              className="w-full py-5 bg-black hover:bg-gray-800 text-white font-bold text-xl rounded-xl shadow-lg transform transition hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'İşleniyor...' : `❤️ ${amount > 0 ? amount + ' TL ' : ''}Bağış Yap`}
            </button>

          </div>
          {/* --- ÖDEME ALANI BİTİŞ --- */}

        </div>
      </div>
    </div>
  );
}
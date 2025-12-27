'use client';

import { useEffect, useState, use } from 'react';
import { createClient } from '@supabase/supabase-js';
// useRouter satırını sildik çünkü kullanmıyoruz, uyarı ondan çıkıyordu.

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CampaignDetail({ params }) {
  const { slug } = use(params);

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  const [amount, setAmount] = useState(100); 
  const [email, setEmail] = useState('');    
  
  // const router = useRouter(); <-- Bunu da sildik, gerek yok.

  useEffect(() => {
    async function getData() {
      const { data: campData } = await supabase
        .from('campaigns')
        .select('*')
        .eq('slug', slug)
        .single();
      
      setCampaign(campData);

      const { data: { user: userData } } = await supabase.auth.getUser();
      setUser(userData);

      if (userData?.email) {
        setEmail(userData.email);
      }
    }
    
    if (slug) { getData(); }
  }, [slug]);

  const handlePayment = async () => {
    if(!campaign) return;
    if(!email) { alert("Lütfen e-posta adresinizi giriniz."); return; }
    if(amount <= 0) { alert("Lütfen geçerli bir tutar giriniz."); return; }

    setLoading(true);

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: amount,
          campaignName: campaign.title,
          userEmail: email
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

  if (!campaign) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        <div className={`h-4 ${campaign.color || 'bg-blue-500'} w-full`}></div>

        <div className="p-8">
          <div className="flex justify-between items-start">
             <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{campaign.title}</h1>
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full uppercase font-semibold">
                  Aktif Kampanya
                </span>
             </div>
             <div className="text-6xl">{campaign.logo}</div>
          </div>

          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            {campaign.description}
          </p>

          <div className="mt-10 p-8 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Destek Ol</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. E-POSTA GİRİŞİ */}
                <div>
                    <label className="block text-gray-600 text-sm font-semibold mb-2">E-posta Adresiniz</label>
                    <input
                      type="email"
                      placeholder="ornek@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition bg-white text-lg"
                    />
                </div>

                {/* 2. TUTAR GİRİŞİ */}
                <div>
                    <label className="block text-gray-600 text-sm font-semibold mb-2">Bağış Tutarı</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg font-bold text-gray-800 focus:border-black outline-none transition"
                      />
                      <span className="absolute right-4 top-4 text-gray-500 font-bold">TL</span>
                    </div>
                </div>
            </div>

            {/* 3. ÖDEME BUTONU */}
            <button
              onClick={handlePayment}
              disabled={loading || amount <= 0}
              className="w-full mt-6 py-4 bg-black hover:bg-gray-800 text-white font-bold text-xl rounded-xl shadow-lg transform transition hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'İşleniyor...' : `❤️ ${amount > 0 ? amount + ' TL ' : ''}Bağış Yap`}
            </button>

            <div className="mt-4 text-center">
                {user ? (
                    <p className="text-sm text-green-600">
                      ✅ <b>{user.email}</b> ile giriş yapıldı.
                    </p>
                ) : (
                    <p className="text-xs text-gray-400">
                      Misafir olarak bağış yapıyorsunuz.
                    </p>
                )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
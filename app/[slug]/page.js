'use client';

import { useEffect, useState, use } from 'react'; // 'use' eklendi
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CampaignDetail({ params }) {
  // --- DÜZELTME BURADA ---
  // Next.js 15'te params bir "Kutu" (Promise) olarak gelir. 
  // İçindeki 'slug'ı almak için onu 'use' ile açıyoruz.
  const { slug } = use(params);
  // -----------------------

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); 
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      // 1. Kampanya verisini çek (Artık 'slug' değişkenini kullanıyoruz)
      const { data: campData } = await supabase
        .from('campaigns')
        .select('*')
        .eq('slug', slug) 
        .single();
      
      setCampaign(campData);

      // 2. Giriş yapan kullanıcı var mı bak
      const { data: { user: userData } } = await supabase.auth.getUser();
      setUser(userData);
    }
    
    // slug geldiyse çalıştır
    if (slug) {
        getData();
    }
  }, [slug]); 

  const handlePayment = async () => {
    if(!campaign) return;
    setLoading(true);

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: 100, 
          campaignName: campaign.title,
          userEmail: user ? user.email : null 
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        window.location.href = data.paymentPageUrl; 
      } else {
        alert('Ödeme başlatılamadı: ' + data.errorMessage);
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

          <div className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Bağış Tutarı</p>
              <p className="text-3xl font-bold text-gray-900">100.00 ₺</p>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 bg-black hover:bg-gray-800 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-md disabled:opacity-50"
            >
              {loading ? 'İşleniyor...' : `❤️ ${user ? 'Bağış Yap' : 'Misafir Olarak Bağış Yap'}`}
            </button>
          </div>
          
          {user ? (
            <p className="mt-4 text-sm text-green-600 text-center">
              👤 <b>{user.email}</b> hesabıyla bağış yapıyorsunuz. Listede görünecek.
            </p>
          ) : (
            <p className="mt-4 text-sm text-gray-400 text-center">
              Giriş yapmadınız. Bağışınız &quot;Misafir&quot; olarak kaydedilecek.
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
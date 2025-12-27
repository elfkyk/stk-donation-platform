'use client'; // <-- ARTIK TARAYICIDA ÇALIŞACAK, LOGİNİ GÖRECEK

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Veya createClient ile buradan da oluşturabilirsin
import Link from 'next/link';
import Header from './components/Header'; 

// Yönetici Maili
const ADMIN_EMAIL = 'admin123@gmail.com';

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initPage() {
      // 1. Kampanyaları Çek
      const { data, error } = await supabase
        .from('campaigns')
        .select('*');
      
      if (data) setCampaigns(data);
      if (error) console.error("Supabase Hatası:", error);

      // 2. Kullanıcıyı Kontrol Et
      const { data: { user } } = await supabase.auth.getUser();
      
      // Eğer kullanıcı varsa VE maili admin mailiyle aynıysa
      if (user && user.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    }

    initPage();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* Üst Menü */}
      <Header />

      {/* Hero Bölümü */}
      <div className="bg-black text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">STK Platform Engine</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Sivil Toplum Kuruluşları için Hızlı Bağış Kampanyası altyapısı.
        </p>
        
        {/* Yükleniyor durumunda boşluk bırak veya spinner koy */}
        {!loading && isAdmin && (
          <div className="mt-8">
            <Link href="/admin" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition border-4 border-blue-500 inline-block">
              🚀 Yeni Kampanya Başlat (Admin)
            </Link>
            <p className="text-xs text-gray-500 mt-2">Yönetici yetkisi algılandı: {ADMIN_EMAIL}</p>
          </div>
        )}
      </div>

      {/* Kampanya Listesi */}
      <div className="container mx-auto p-10">
        <h2 className="text-2xl font-bold mb-8 border-l-4 border-black pl-4">
          Aktif Kampanyalar
        </h2>

        {/* Yükleniyor... */}
        {loading && <p className="text-center text-gray-500">Kampanyalar yükleniyor...</p>}

        {/* Kampanya Yoksa */}
        {!loading && campaigns.length === 0 && (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 mb-4">Henüz aktif bir kampanya bulunamadı.</p>
            {isAdmin && (
              <Link href="/admin" className="text-blue-600 underline font-bold">
                İlk Kampanyayı Oluşturun →
              </Link>
            )}
          </div>
        )}

        {/* Liste */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((camp) => (
            <Link key={camp.id} href={`/${camp.slug}`} className="group">
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all h-full flex flex-col">
                <div className={`h-3 ${camp.color || 'bg-gray-200'} w-full`}></div>
                
                <div className="p-6 flex-grow">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform w-min">
                    {camp.logo || '🌟'}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                    {camp.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3">
                    {camp.description}
                  </p>
                </div>
                
                <div className="p-6 pt-0 mt-auto">
                  <span className="text-sm font-bold underline">Kampanyayı İncele →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
    </div>
  );
}
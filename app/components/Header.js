'use client'; // Bu bir istemci bileşeni (Tarayıcıda çalışır)

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Supabase Bağlantısı
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Sayfa açılınca "Kim var?" diye kontrol et
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  // Çıkış Yap Fonksiyonu
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh(); // Sayfayı yenile
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', padding: '15px 30px', backgroundColor: '#fff', borderBottom: '1px solid #ddd' }}>
      
      {/* Herkese görünen Bağışlarım linki */}
      <Link href="/bagislarim" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: '600' }}>
        📂 Geçmiş Bağışlarım
      </Link>

      {/* --- AKILLI KISIM --- */}
      {user ? (
        // EĞER KULLANICI GİRİŞ YAPMIŞSA BU GÖRÜNÜR:
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#333', fontWeight: 'bold' }}>
            👤 {user.email}
          </span>
          <button 
            onClick={handleLogout}
            style={{ padding: '5px 10px', fontSize: '12px', border: '1px solid red', color: 'red', borderRadius: '5px', cursor: 'pointer', background: 'white' }}>
            Çıkış Yap
          </button>
        </div>
      ) : (
        // EĞER KİMSE YOKSA BU GÖRÜNÜR:
        <Link href="/login" style={{ color: '#28a745', fontWeight: 'bold', textDecoration: 'none' }}>
          🔑 Giriş Yap / Kayıt Ol
        </Link>
      )}
    </div>
  );
}
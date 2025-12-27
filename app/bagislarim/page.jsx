'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Bagislarim() {
  const [bagislar, setBagislar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  useEffect(() => {
    async function getData() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      setCurrentUserEmail(user.email);

      const { data } = await supabase
        .from('payments')
        .select('*')
        .eq('donor_email', user.email)
        .order('created_at', { ascending: false });

      if (data) {
        setBagislar(data);
      }
      setLoading(false);
    }

    getData();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#000' }}>Yükleniyor...</div>;

  if (!currentUserEmail) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#000' }}>
        <h2 style={{ color: 'red' }}>Giriş Yapmalısınız</h2>
        <p>Geçmiş bağışlarınızı görmek için lütfen giriş yapın.</p>
        <Link href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>Giriş Yap</Link>
      </div>
    );
  }

  return (
    // DÜZELTME 1: Tüm sayfanın yazı rengini koyu (#333) yaptık
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', color: '#333' }}>
      
      <h1 style={{ marginBottom: '20px', color: '#000' }}>Geçmiş Bağışlarım</h1>
      
      <p style={{ marginBottom: '20px', color: '#555' }}>
        Kullanıcı: <b>{currentUserEmail}</b>
      </p>

      {bagislar.length === 0 ? (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd', color: '#333' }}>
          <p>Henüz bu hesapla yapılmış bir bağışınız görünmüyor.</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: 'white' }}>
          <thead>
            {/* DÜZELTME 2: Başlık satırının rengini 'black' olarak zorladık */}
            <tr style={{ borderBottom: '2px solid #ccc', backgroundColor: '#f1f1f1', color: 'black' }}>
              <th style={{ padding: '10px' }}>Tarih</th>
              <th style={{ padding: '10px' }}>Kampanya</th>
              <th style={{ padding: '10px' }}>Tutar</th>
              <th style={{ padding: '10px' }}>Durum</th>
            </tr>
          </thead>
          <tbody>
            {bagislar.map((bagis) => (
              // DÜZELTME 3: Satırların rengini 'black' olarak zorladık
              <tr key={bagis.id} style={{ borderBottom: '1px solid #eee', color: 'black' }}>
                <td style={{ padding: '10px' }}>
                  {new Date(bagis.created_at).toLocaleDateString('tr-TR')}
                </td>
                <td style={{ padding: '10px' }}>
                  {bagis.campaign_name || 'Genel Bağış'}
                </td>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>
                  {bagis.price} TL
                </td>
                <td style={{ padding: '10px', color: 'green' }}>
                  Başarılı
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '30px' }}>
         <Link href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
            ← Anasayfaya Dön
         </Link>
      </div>
    </div>
  );
}
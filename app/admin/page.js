'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ADMIN_EMAIL = 'admin123@gmail.com'; 

// --- YENİ EKLENEN: KULLANILACAK EMOJİ LİSTESİ ---
const EMOJI_LIST = ['🌟', '❤️', '🧸', '📚', '🏥', '🌳', '💧', '🍞', '🤝', '🏠', '🩺', '🎒'];

export default function Admin() {
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('bg-blue-500');
  // --- YENİ STATE: SEÇİLEN EMOJİ (Varsayılan yıldız) ---
  const [emoji, setEmoji] = useState('🌟'); 
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push('/'); 
      } else {
        setIsAuthorized(true);
      }
    }
    checkAdmin();
  }, [router]);

  if (!isAuthorized) {
    return <div style={{ display:'flex', justifyContent:'center', marginTop:'50px', color:'black' }}>Yetki kontrolü yapılıyor...</div>;
  }

  const handleCreate = async () => {
    setLoading(true);
    setMessage('');

    const cleanSlug = slug.toLowerCase().replace(/ /g, '-');

    const { error } = await supabase
      .from('campaigns')
      .insert({
        slug: cleanSlug,
        title,
        description,
        color,
        logo: emoji // <-- ARTIK SEÇİLEN EMOJİYİ KAYDEDİYORUZ
      });

    setLoading(false);

    if (error) {
      setMessage('Hata: ' + error.message);
    } else {
      setMessage('✅ Kampanya başarıyla oluşturuldu!');
      setSlug('');
      setTitle('');
      setDescription('');
      setEmoji('🌟'); // Emojiyi sıfırla
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxWidth: '500px', width: '100%', color: '#333' }}>
        
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center', color: '#111' }}>
          🚀 Yeni Kampanya Paneli
        </h1>
        <p style={{textAlign:'center', marginBottom:'20px', fontSize:'12px', color:'green'}}>
           Hoşgeldin Yönetici: {ADMIN_EMAIL}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* URL Adresi */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>URL Adresi (Slug)</label>
            <input 
              type="text" 
              placeholder="koy-okullarina-yardim" 
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', color: 'black', backgroundColor: 'white' }} 
            />
          </div>

          {/* Başlık */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Kampanya Başlığı</label>
            <input 
              type="text" 
              placeholder="Örn: Geleceğe Işık Tut" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', color: 'black', backgroundColor: 'white' }} 
            />
          </div>

          {/* Açıklama */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Açıklama</label>
            <textarea 
              rows="4"
              placeholder="Kampanya detaylarını buraya yaz..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', color: 'black', backgroundColor: 'white', fontFamily: 'sans-serif' }} 
            />
          </div>

          {/* Renk Seçimi */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Tema Rengi</label>
            <select 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', color: 'black', backgroundColor: 'white' }}
            >
              <option value="bg-blue-500">🔵 Mavi</option>
              <option value="bg-red-500">🔴 Kırmızı</option>
              <option value="bg-green-500">🟢 Yeşil</option>
              <option value="bg-purple-500">🟣 Mor</option>
              <option value="bg-yellow-500">🟡 Sarı</option>
            </select>
          </div>

          {/* --- YENİ EKLENEN: İKON SEÇİMİ --- */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Kampanya İkonu</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {EMOJI_LIST.map((item) => (
                <button
                  key={item}
                  onClick={() => setEmoji(item)}
                  style={{
                    fontSize: '24px',
                    padding: '10px',
                    border: emoji === item ? '2px solid blue' : '1px solid #ccc', // Seçili olanı vurgula
                    borderRadius: '8px',
                    backgroundColor: emoji === item ? '#e6f0ff' : 'white',
                    cursor: 'pointer'
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          {/* ---------------------------------- */}

          {/* Mesaj Kutusu ve Buton */}
          {message && (
            <div style={{ padding: '10px', borderRadius: '5px', backgroundColor: message.includes('Hata') ? '#fee2e2' : '#dcfce7', color: message.includes('Hata') ? 'red' : 'green', textAlign: 'center' }}>
              {message}
            </div>
          )}

          <button 
            onClick={handleCreate}
            disabled={loading}
            style={{ marginTop: '10px', padding: '15px', backgroundColor: 'black', color: 'white', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Kaydediliyor...' : 'Kampanyayı Yayına Al'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <Link href="/" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>
               ← Anasayfaya Dön
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
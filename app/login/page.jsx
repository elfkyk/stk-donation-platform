'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    setMessage(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setIsError(true);
      setMessage('Kayıt Hatası: ' + error.message);
    } else {
      setIsError(false);
      setMessage('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setMessage(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setIsError(true);
      setMessage('Giriş Hatası: ' + error.message);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Kart Yapısı - Yazı rengini zorla siyah (#333) yapıyoruz */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 space-y-6" style={{ color: '#333' }}>
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Hoş Geldiniz</h2>
          <p className="mt-2 text-sm text-gray-500">
            Bağışlarınızı yönetmek için giriş yapın
          </p>
        </div>

        <div className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // DÜZELTME: text-black ve placeholder-gray-400 ekledik
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black placeholder-gray-400"
              placeholder="ornek@email.com"
              style={{ color: 'black' }} // Garanti olsun diye style da ekledik
            />
          </div>

          {/* Şifre Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // DÜZELTME: text-black ve placeholder-gray-400 ekledik
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black placeholder-gray-400"
              placeholder="••••••"
              style={{ color: 'black' }} // Garanti olsun diye style da ekledik
            />
          </div>

          {/* Hata/Bilgi Mesajı Kutusu */}
          {message && (
            <div className={`p-4 rounded-lg text-sm ${isError ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {message}
            </div>
          )}

          {/* Butonlar */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? 'İşleniyor...' : 'Giriş Yap'}
            </button>
            
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Kayıt Ol
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
           <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 underline">
             &larr; Anasayfaya Dön
           </Link>
        </div>

      </div>
    </div>
  );
}
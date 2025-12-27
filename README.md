# 🤝 STK Bağış Platformu (Next.js + Supabase + Iyzipay)

Bu proje, Sivil Toplum Kuruluşları (STK) için geliştirilmiş, modern ve güvenli bir bağış toplama platformudur. Kullanıcılar kampanyaları inceleyebilir, giriş yaparak veya misafir olarak kredi kartı ile güvenli bağış yapabilirler.

## 🚀 Özellikler
- **Dinamik Kampanya Yönetimi:** Kampanyalar veritabanından (Supabase) dinamik olarak çekilir.
- **Güvenli Ödeme:** Iyzico / Iyzipay altyapısı ile test ödemeleri alınır.
- **Kullanıcı Takibi:** Supabase Auth ile kullanıcı girişi ve bağış geçmişi takibi.
- **Responsive Tasarım:** Tailwind CSS ile hem mobil hem masaüstü uyumlu modern arayüz.
- **Özel Bağış Tutarı:** Kullanıcılar istedikleri tutarı özgürce girebilir.

## 🛠️ Kullanılan Teknolojiler
- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes
- **Veritabanı:** Supabase (PostgreSQL)
- **Ödeme:** Iyzipay (Node.js SDK)

## 📦 Kurulum (Lokalde Çalıştırmak İçin)

1. Projeyi bilgisayarınıza indirin.
2. Gerekli paketleri yükleyin:
   ```bash
   npm install

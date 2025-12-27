import { NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const token = formData.get('token');
    
    // 1. URL'deki gizli email parametresini okuyoruz
    const urlObj = new URL(request.url);
    const donorEmail = urlObj.searchParams.get('email') || 'misafir@kullanici.com';

    const iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: 'https://sandbox-api.iyzipay.com'
    });

    return new Promise((resolve) => {
      iyzipay.checkoutForm.retrieve({ token: token }, async (err, result) => {
        
        if (err || result.status !== 'success' || result.paymentStatus !== 'SUCCESS') {
           return resolve(NextResponse.redirect(new URL('/odeme-basarisiz', request.url)));
        }

        // 2. Veritabanına ARTIK GERÇEK EMAIL ile kaydediyoruz
        const { error } = await supabase
          .from('payments')
          .insert({
            price: result.paidPrice,
            payment_id: result.paymentId,
            status: 'success',
            campaign_name: result.basketId,
            donor_email: donorEmail // <-- İŞTE BURASI DÜZELDİ
          });

        return resolve(NextResponse.redirect(new URL('/odeme-basarili', request.url)));
      });
    });

  } catch (error) {
    return NextResponse.json({ error: 'Hata' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';
import 'postman-request';

export async function POST(request) {
  try {
    const body = await request.json();
    const { price, campaignName, userEmail } = body;

    // 1. FİYAT FORMATINI GARANTİYE ALIYORUZ (Örn: "100.00")
    // Iyzico bazen tam sayı, bazen virgüllü sayı konusunda hassas olabiliyor.
    const amount = parseFloat(price).toFixed(2); 

    // 2. Callback URL'i dinamik yapıyoruz (Vercel veya Localhost)
    // Eğer vercel'deysen kendi domainini, localdeysen localhost'u algılar.
    const baseUrl = request.headers.get('origin') || 'https://stk-donation-platform.vercel.app';

    const iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: 'https://sandbox-api.iyzipay.com'
    });

    const requestData = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: '123456789',
      price: amount,
      paidPrice: amount,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: 'B67832',
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      // Callback URL'in sonuna email ekliyoruz ki dönüşte kim olduğunu bilelim
      callbackUrl: `${baseUrl}/api/payment/callback?email=${userEmail || 'misafir'}`,
      
      // IYZICO'NUN İSTEDİĞİ ZORUNLU ALANLAR (DUMMY DATA)
      // Bu bilgiler olmazsa "Genel Hata" verir.
      buyer: {
        id: 'BY789',
        name: 'Bagis',
        surname: 'Sever',
        gsmNumber: '+905350000000',
        email: userEmail || 'email@email.com',
        identityNumber: '74300864791', // Geçerli bir TC No formatı şart
        lastLoginDate: '2015-10-05 12:43:35',
        registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732'
      },
      shippingAddress: {
        contactName: 'Jane Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34742'
      },
      billingAddress: {
        contactName: 'Jane Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34742'
      },
      basketItems: [
        {
          id: 'BI101',
          name: campaignName || 'Bagis Kampanyasi',
          category1: 'Bagis',
          category2: 'STK',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: amount // Buradaki fiyat ile yukarıdaki 'paidPrice' AYNISI OLMALI
        }
      ]
    };

    return new Promise((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(requestData, (err, result) => {
        if (err || result.status !== 'success') {
           console.error("Iyzico Başlatma Hatası:", result?.errorMessage);
           resolve(NextResponse.json({ 
             status: 'failure', 
             errorMessage: result?.errorMessage || 'Iyzico başlatılamadı' 
           }, { status: 400 }));
        } else {
           resolve(NextResponse.json({ 
             status: 'success', 
             htmlContent: result.checkoutFormContent 
           }));
        }
      });
    });

  } catch (error) {
    console.error("Sunucu Hatası:", error);
    return NextResponse.json({ status: 'failure', errorMessage: error.message }, { status: 500 });
  }
}
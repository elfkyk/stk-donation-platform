import { NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';
import 'postman-request';

export async function POST(request) {
  try {
    console.log("➡️ 1. Ödeme isteği API'ye ulaştı.");

    // Verileri almayı dene
    const body = await request.json();
    const { price, campaignName, userEmail } = body;
    console.log("➡️ 2. Gelen veriler:", { price, campaignName, userEmail });

    // Şifreleri kontrol et (Güvenlik için sadece var mı yok mu diye bakıyoruz)
    const apiKey = process.env.IYZICO_API_KEY;
    const secretKey = process.env.IYZICO_SECRET_KEY;

    if (!apiKey || !secretKey) {
        console.error("❌ HATA: API Key veya Secret Key okunamadı! .env ayarlarını kontrol et.");
        return NextResponse.json({ error: 'Sunucu tarafında API anahtarları eksik.' }, { status: 500 });
    }
    console.log(`➡️ 3. Anahtarlar bulundu. API Key uzunluğu: ${apiKey.length}`);

    // Iyzipay'i başlat
    const iyzipay = new Iyzipay({
      apiKey: apiKey,
      secretKey: secretKey,
      uri: 'https://sandbox-api.iyzipay.com'
    });
    console.log("➡️ 4. Iyzipay nesnesi oluşturuldu.");

    // Kullanıcı email ve callback ayarı
    const emailToSave = userEmail || 'misafir@kullanici.com';
    // BURAYA DİKKAT: Canlı site adresin olduğundan emin ol
    const callbackWithEmail = `https://stk-donation-platform.vercel.app/api/payment/callback?email=${encodeURIComponent(emailToSave)}`;
    
    console.log("➡️ 5. Iyzico'ya istek gönderiliyor... Callback:", callbackWithEmail);

    const requestData = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: '123456789',
      price: price,
      paidPrice: price,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: campaignName,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: callbackWithEmail,
      enabledInstallments: [2, 3, 6, 9],
      buyer: {
        id: 'BY789',
        name: 'Hayırsever',
        surname: 'Vatandaş',
        gsmNumber: '+905350000000',
        email: emailToSave,
        identityNumber: '74300864791',
        lastLoginDate: '2015-10-05 12:43:35',
        registrationAddress: 'Istanbul',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732'
      },
      shippingAddress: {
        contactName: 'Hayırsever Vatandaş',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Istanbul',
        zipCode: '34742'
      },
      billingAddress: {
        contactName: 'Hayırsever Vatandaş',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Istanbul',
        zipCode: '34742'
      },
      basketItems: [
        {
          id: 'BI101',
          name: campaignName,
          category1: 'Bağış',
          category2: 'STK',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: price
        }
      ]
    };

    return new Promise((resolve) => {
      iyzipay.checkoutFormInitialize.create(requestData, (err, result) => {
        if (err) {
            console.error("❌ IYZICO BAĞLANTI HATASI:", err);
            resolve(NextResponse.json({ status: 'failure', errorMessage: 'Bağlantı hatası' }));
        } else if (result.status !== 'success') {
            console.error("❌ IYZICO İŞLEM HATASI:", result.errorMessage);
            resolve(NextResponse.json({ status: 'failure', errorMessage: result.errorMessage }));
        } else {
            console.log("✅ 6. Başarılı! Form token alındı.");
            resolve(NextResponse.json(result));
        }
      });
    });

  } catch (error) {
    console.error("🔥 KRİTİK HATA (CATCH):", error);
    return NextResponse.json({ error: error.message || 'Sunucu hatası' }, { status: 500 });
  }
}
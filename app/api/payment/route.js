import { NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';

export async function POST(request) {
  try {
    // 1. Frontend'den gelen userEmail verisini alıyoruz
    const { price, campaignName, userEmail } = await request.json();

    const iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: 'https://sandbox-api.iyzipay.com'
    });

    // Email varsa onu kullan, yoksa 'misafir' olsun
    const emailToSave = userEmail || 'misafir@kullanici.com';

    // 2. E-postayı 'callbackUrl' içine gizliyoruz ki dönüşte geri alalım
    // Örn: .../callback?email=elifkyk@gmail.com
    const callbackWithEmail = `http://localhost:3000/api/payment/callback?email=${encodeURIComponent(emailToSave)}`;

    const requestData = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: '123456789',
      price: price,
      paidPrice: price,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: campaignName,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: callbackWithEmail, // <-- GÜNCELLENDİ
      enabledInstallments: [2, 3, 6, 9],
      buyer: {
        id: 'BY789',
        name: 'Hayırsever',
        surname: 'Vatandaş',
        gsmNumber: '+905350000000',
        email: emailToSave, // <-- GÜNCELLENDİ
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
        if (err || result.status !== 'success') {
            resolve(NextResponse.json({ 
                status: 'failure', 
                errorMessage: result?.errorMessage 
            }));
        } else {
            resolve(NextResponse.json(result));
        }
      });
    });

  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
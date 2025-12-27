import Link from 'next/link'; // Bu satırı ekliyoruz

export default function Basarili() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ color: 'green' }}>Ödeme Başarılı! 🎉</h1>
      <p>Bağışınız için teşekkür ederiz.</p>
      {/* <a> yerine <Link> kullanıyoruz: */}
      <Link href="/" style={{ textDecoration: 'underline', color: 'blue' }}>
        Anasayfaya Dön
      </Link>
    </div>
  )
}
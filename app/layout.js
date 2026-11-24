import Script from 'next/script';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Discovery – your daily update',
  description: 'Daily stories on trending topics, travel news, international information and interviews.',
  manifest: '/manifest.json',
};
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#0f1b2d' };

export default function RootLayout({ children }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return (
    <html lang="en">
      <body>
        {client && <Script async strategy="afterInteractive" crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`} />}
        <div className="wrap">
          <div className="top"><Link href="/" className="logo">Discovery</Link></div>
          {children}
          <footer style={{ padding: '30px 0', color: 'var(--mut)', fontSize: 14 }}>Discovery – updated daily.</footer>
        </div>
      </body>
    </html>
  );
}

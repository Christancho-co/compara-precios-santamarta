import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mercado Curado | Compara Precios en Santa Marta',
  description: 'Encuentra el precio más bajo en Éxito, D1, Ara, Olímpica y Megatiendas. Ahorra tiempo y dinero en tu mercado diario.',
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Mercado Curado',
    statusBarStyle: 'default',
    capable: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#014421',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased overflow-x-hidden select-none`}>
        {children}
      </body>
    </html>
  );
}

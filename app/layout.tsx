import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Karrot Market',
    default: 'Karrot Market',
  },
  description: '중고물품 사고팝니다~',
};

interface RootLayoutProps {
  children: React.ReactNode;
  potato: React.ReactNode;
}

export default function RootLayout(props: Readonly<RootLayoutProps>) {
  const { children, potato } = props;

  console.log(props);
  return (
    <html lang='en'>
      <body className={`${inter.className} bg-neutral-900 text-white max-w-screen-sm mx-auto`}>
        {potato}
        {children}
      </body>
    </html>
  );
}

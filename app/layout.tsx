import type { Metadata } from 'next';
import { Inter, Noto_Sans, Anton } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  variable: '--notosans-text',
});

const AntonFont = Anton({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  variable: '--anton-text',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Karrot Market',
    default: 'Karrot Market',
  },
  description: '중고물품 사고팝니다~',
};

/** 로컬 폰트 사용법
 * (주의점) body에 variable 를 등록해야함.
 */
const metalFont = localFont({
  src: './MetalMania-Regular.ttf',
  variable: '--metal-text',
  weight: '500',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body
        /** variables 에 등록한 뒤에 className 에 variables 를 등록해야한다.!! */
        className={`${notoSans.variable} ${metalFont.variable} ${AntonFont.variable} bg-neutral-900 text-white max-w-screen-sm mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}

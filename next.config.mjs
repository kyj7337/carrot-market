/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatars.githubusercontent.com',
      },
      {
        hostname: 'imagedelivery.net',
      },
      {
        hostname: 'phinf.pstatic.net',
      },
    ], // * 이 hostname 의 URL 이미지를 최적화 할 수 있게 허용한다 라는 의미
  },
  experimental: {
    taint: true,
  },
};

export default nextConfig;

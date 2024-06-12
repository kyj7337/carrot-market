/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'avatars.githubusercontent.com',
      },
    ], // * 이 hostname 의 URL 이미지를 최적화 할 수 있게 허용한다 라는 의미
  },
};

export default nextConfig;

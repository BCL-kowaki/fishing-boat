/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Instagram CDN (Behold.so経由)
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
      // Behold.so CDN
      { protocol: "https", hostname: "**.behold.so" },
    ],
  },
};

export default nextConfig;

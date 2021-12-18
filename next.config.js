/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/emoticon/\\[:slug\\]",
        destination: "/api/emoticon/%5B:slug%5D",
        permanent: true,
      },
      {
        source: "/emoticon/%5B:slug%5D",
        destination: "/api/emoticon/%5B:slug%5D",
        permanent: true,
      },
    ];
  },
};

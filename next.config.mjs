/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/day-1",
        destination: "/legacy/day1to5/index.html?day=1",
        permanent: true,
      },
      {
        source: "/day-2",
        destination: "/legacy/day1to5/index.html?day=2",
        permanent: true,
      },
      {
        source: "/day-3",
        destination: "/legacy/day1to5/index.html?day=3",
        permanent: true,
      },
      {
        source: "/day-4",
        destination: "/legacy/day1to5/index.html?day=4",
        permanent: true,
      },
      {
        source: "/day-5",
        destination: "/legacy/day6-promise/index.html",
        permanent: true,
      },
      {
        source: "/day-6",
        destination: "/legacy/day1to5/index.html?day=5",
        permanent: true,
      },
      {
        source: "/day-7",
        destination: "/legacy/day7-kiss/index.html",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

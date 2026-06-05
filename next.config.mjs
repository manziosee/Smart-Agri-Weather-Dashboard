const nextConfig = {
  // Required for Docker / Fly.io — produces a self-contained .next/standalone folder
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;

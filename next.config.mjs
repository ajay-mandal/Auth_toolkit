/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Optimize webpack cache to handle large strings better
    if (config.cache && typeof config.cache === 'object') {
      config.cache.maxMemoryGenerations = 1;
    }
    
    // Suppress the webpack cache serialization warning
    config.infrastructureLogging = {
      level: 'error',
    };
    
    return config;
  },
};

export default nextConfig;

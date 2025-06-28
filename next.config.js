/** @type {import('next').NextConfig} */
const nextConfig = {
    // ... other configurations
    experimental: {
      allowedDevOrigins: [
        '9000-firebase-studio-1749546750665.cluster-c3a7z3wnwzapkx3rfr5kz62dac.cloudworkstations.dev'
      ]
    }
  };
  
  module.exports = nextConfig;
  
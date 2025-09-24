import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [new URL('https://placeholder.pagebee.io/api/random/**')],
    },
};

export default nextConfig;

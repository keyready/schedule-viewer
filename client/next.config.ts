import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [new URL('https://placeholder.pagebee.io/api/random/**')],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://server:5000/api/:path*',
            },
        ];
    },
};

export default nextConfig;

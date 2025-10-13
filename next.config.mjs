/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '53eb0owvddr0kz0k.public.blob.vercel-storage.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/dashboard',          
                destination: '/admin/dashboard', 
                permanent: true,               
            },
        ]
    },
};

export default nextConfig;

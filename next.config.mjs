/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        unoptimized: true,
    },
    // Required for Socket.IO
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },
}

export default nextConfig


/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // The project is on TypeScript 7, which no longer exposes the compiler API
    // Next.js uses directly. This routes type checking through the TS CLI instead.
    useTypeScriptCli: true
  }
};

export default nextConfig;

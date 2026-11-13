import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["postgres", "drizzle-orm", "stripe"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals ?? []), "postgres"];
    } else {
      config.resolve.alias = {
        ...config.resolve.alias,
        postgres: false,
        "drizzle-orm/postgres-js": false,
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "l.icdbcdn.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);

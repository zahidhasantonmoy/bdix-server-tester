// Next.js with Sentry configuration
import { withSentryConfig } from '@sentry/nextjs';

const moduleExports = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    reactCompiler: true,
  },
  images: {
    domains: ['localhost'],
  },
};

const sentryWebpackPluginOptions = {
  org: "bdix-tester",
  project: "bdix-tester",
  silent: true,
};

export default withSentryConfig(moduleExports, sentryWebpackPluginOptions);
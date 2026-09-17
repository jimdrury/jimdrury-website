type ContentSecurityPolicyOptions = {
  isDevelopment: boolean;
};

export const buildContentSecurityPolicy = ({
  isDevelopment,
}: ContentSecurityPolicyOptions): string => {
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    isDevelopment ? "'unsafe-eval'" : undefined,
    "https://app.storyblok.com",
    "https://va.vercel-scripts.com",
  ]
    .filter((source): source is string => Boolean(source))
    .join(" ");

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    `script-src ${scriptSrc}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https://a.storyblok.com https://img2.storyblok.com",
    "font-src 'self'",
    "connect-src 'self' https://api.storyblok.com https://app.storyblok.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
    "frame-src https://www.youtube-nocookie.com https://app.storyblok.com",
    "media-src 'self' https://a.storyblok.com",
    "worker-src 'self' blob:",
    "frame-ancestors 'self' https://app.storyblok.com https://app.eu.storyblok.com https://plugin.storyblok.com",
    "upgrade-insecure-requests",
  ].join("; ");
};

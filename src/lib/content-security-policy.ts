type ContentSecurityPolicyOptions = {
  isDevelopment: boolean;
};

export const buildContentSecurityPolicy = ({
  isDevelopment,
}: ContentSecurityPolicyOptions): string => {
  const scriptSrc = [
    "'self'",
    // Next.js streams the RSC payload in inline scripts. Replacing this with
    // nonces would force every page to render dynamically, which conflicts
    // with `cacheComponents` and the static shells this site relies on.
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

type SecurityHeader = { key: string; value: string };

/**
 * Every security header the site sends. Keep them all here: a second
 * `Content-Security-Policy` from another layer (e.g. vercel.json) is enforced
 * alongside this one, so the browser only allows what both policies allow.
 */
export const buildSecurityHeaders = (
  options: ContentSecurityPolicyOptions,
): SecurityHeader[] => {
  return [
    {
      key: "Content-Security-Policy",
      value: buildContentSecurityPolicy(options),
    },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  ];
};

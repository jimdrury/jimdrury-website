import { createHmac, timingSafeEqual } from "node:crypto";

export const WEBHOOK_SIGNATURE_HEADER = "webhook-signature";

/**
 * Verifies a Storyblok signed webhook: the `webhook-signature` header holds
 * the hex HMAC-SHA1 of the raw request body, keyed with the webhook secret.
 */
export const isValidWebhookSignature = ({
  rawBody,
  signature,
  secret,
}: {
  rawBody: string;
  signature: string | null;
  secret: string;
}): boolean => {
  if (!signature) {
    return false;
  }

  const expected = createHmac("sha1", secret).update(rawBody).digest("hex");
  const providedBuffer = Buffer.from(signature.trim().toLowerCase());
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
};

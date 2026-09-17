import { timingSafeEqual } from "node:crypto";

export const WEBHOOK_SECRET_QUERY_PARAM = "secret";

export const isValidWebhookSecret = ({
  provided,
  expected,
}: {
  provided: string | null;
  expected: string;
}): boolean => {
  if (!provided) {
    return false;
  }

  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
};

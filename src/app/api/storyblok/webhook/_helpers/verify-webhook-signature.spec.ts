import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { isValidStoryblokWebhookSignature } from "./verify-webhook-signature";

const SECRET = "webhook-secret";
const BODY = '{"action":"story.published","full_slug":"about"}';

const sign = (body: string, secret = SECRET): string => {
  return createHmac("sha1", secret).update(body).digest("hex");
};

describe("isValidStoryblokWebhookSignature", () => {
  it("accepts a matching HMAC-SHA1 signature of the raw body", () => {
    expect(
      isValidStoryblokWebhookSignature({
        rawBody: BODY,
        signature: sign(BODY),
        secret: SECRET,
      }),
    ).toBe(true);
  });

  it("rejects a missing signature", () => {
    expect(
      isValidStoryblokWebhookSignature({
        rawBody: BODY,
        signature: null,
        secret: SECRET,
      }),
    ).toBe(false);
  });

  it("rejects an invalid signature without throwing on length mismatch", () => {
    expect(
      isValidStoryblokWebhookSignature({
        rawBody: BODY,
        signature: "deadbeef",
        secret: SECRET,
      }),
    ).toBe(false);
  });

  it("rejects a signature produced with a different secret", () => {
    expect(
      isValidStoryblokWebhookSignature({
        rawBody: BODY,
        signature: sign(BODY, "other-secret"),
        secret: SECRET,
      }),
    ).toBe(false);
  });
});

import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { isValidWebhookSignature } from "./verify-webhook-signature";

const SECRET = "webhook-secret";
const BODY = '{"action":"story.published","full_slug":"about"}';

const sign = (body: string, secret = SECRET) =>
  createHmac("sha1", secret).update(body).digest("hex");

describe("isValidWebhookSignature", () => {
  it("accepts the HMAC-SHA1 of the raw body", () => {
    expect(
      isValidWebhookSignature({
        rawBody: BODY,
        signature: sign(BODY),
        secret: SECRET,
      }),
    ).toBe(true);
  });

  it("rejects a missing signature", () => {
    expect(
      isValidWebhookSignature({
        rawBody: BODY,
        signature: null,
        secret: SECRET,
      }),
    ).toBe(false);
  });

  it("rejects an empty signature", () => {
    expect(
      isValidWebhookSignature({ rawBody: BODY, signature: "", secret: SECRET }),
    ).toBe(false);
  });

  it("rejects a signature made with a different secret", () => {
    expect(
      isValidWebhookSignature({
        rawBody: BODY,
        signature: sign(BODY, "other-secret"),
        secret: SECRET,
      }),
    ).toBe(false);
  });

  it("rejects a valid signature for a tampered body", () => {
    expect(
      isValidWebhookSignature({
        rawBody: `${BODY} `,
        signature: sign(BODY),
        secret: SECRET,
      }),
    ).toBe(false);
  });

  it("rejects a wrong-length signature without throwing", () => {
    expect(
      isValidWebhookSignature({
        rawBody: BODY,
        signature: "abc",
        secret: SECRET,
      }),
    ).toBe(false);
  });

  it("rejects the raw secret sent as the signature", () => {
    expect(
      isValidWebhookSignature({
        rawBody: BODY,
        signature: SECRET,
        secret: SECRET,
      }),
    ).toBe(false);
  });
});

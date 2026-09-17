import { describe, expect, it } from "vitest";
import { isValidWebhookSecret } from "./verify-webhook-secret";

const EXPECTED = "webhook-secret";

describe("isValidWebhookSecret", () => {
  it("accepts the raw expected secret", () => {
    expect(
      isValidWebhookSecret({
        provided: EXPECTED,
        expected: EXPECTED,
      }),
    ).toBe(true);
  });

  it("rejects a missing secret", () => {
    expect(
      isValidWebhookSecret({
        provided: null,
        expected: EXPECTED,
      }),
    ).toBe(false);
  });

  it("rejects an empty secret", () => {
    expect(
      isValidWebhookSecret({
        provided: "",
        expected: EXPECTED,
      }),
    ).toBe(false);
  });

  it("rejects a wrong-length secret without throwing", () => {
    expect(
      isValidWebhookSecret({
        provided: "short",
        expected: EXPECTED,
      }),
    ).toBe(false);
  });

  it("rejects a same-length secret that does not match", () => {
    expect(
      isValidWebhookSecret({
        provided: "webhook-secr3t",
        expected: EXPECTED,
      }),
    ).toBe(false);
  });
});

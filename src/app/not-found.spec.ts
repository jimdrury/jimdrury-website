import { describe, expect, it } from "vitest";
import { metadata } from "./not-found";

describe("not-found metadata", () => {
  it("sets robots index to false", () => {
    expect(metadata.robots).toEqual({ index: false });
  });
});

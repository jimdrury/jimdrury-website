import { describe, expect, it } from "vitest";
import {
  applyHeaderHeight,
  HEADER_HEIGHT_CUSTOM_PROPERTY,
} from "./header-height";

describe("applyHeaderHeight", () => {
  it("writes a rounded pixel custom property", () => {
    const properties = new Map<string, string>();

    applyHeaderHeight(
      {
        setProperty: (name, value) => {
          if (value === null) {
            return;
          }

          properties.set(name, value);
        },
      },
      87.4,
    );

    expect(properties.get(HEADER_HEIGHT_CUSTOM_PROPERTY)).toBe("87px");
  });
});

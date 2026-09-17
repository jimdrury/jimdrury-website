import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  HEADER_HEIGHT_CUSTOM_PROPERTY,
  SITE_HEADER_ATTRIBUTE,
} from "../../_helpers/header-height";
import { HeaderHeight } from "./header-height";

describe("HeaderHeight", () => {
  afterEach(() => {
    document.documentElement.style.removeProperty(
      HEADER_HEIGHT_CUSTOM_PROPERTY,
    );
  });

  it("sets --header-height from the site header", () => {
    const header = document.createElement("header");
    header.setAttribute(SITE_HEADER_ATTRIBUTE, "");
    Object.defineProperty(header, "getBoundingClientRect", {
      value: () => ({ height: 87 }),
    });
    document.body.append(header);

    render(<HeaderHeight />);

    expect(
      document.documentElement.style.getPropertyValue(
        HEADER_HEIGHT_CUSTOM_PROPERTY,
      ),
    ).toBe("87px");

    header.remove();
  });
});

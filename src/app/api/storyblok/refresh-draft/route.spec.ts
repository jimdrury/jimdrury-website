import { cookies, draftMode } from "next/headers";
import { beforeEach, describe, expect, it, vi } from "vitest";

const enable = vi.fn();

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
  draftMode: vi.fn(),
}));

const mockRequestState = ({
  isEnabled,
  cookieValue,
}: {
  isEnabled: boolean;
  cookieValue?: string;
}) => {
  vi.mocked(draftMode).mockResolvedValue({
    isEnabled,
    enable,
    disable: vi.fn(),
  } as unknown as Awaited<ReturnType<typeof draftMode>>);
  vi.mocked(cookies).mockResolvedValue({
    get: (name: string) =>
      name === "__prerender_bypass" && cookieValue !== undefined
        ? { name, value: cookieValue }
        : undefined,
  } as unknown as Awaited<ReturnType<typeof cookies>>);
};

describe("GET /api/storyblok/refresh-draft", () => {
  beforeEach(() => {
    enable.mockReset();
  });

  it("returns 401 without enabling draft mode when there is no draft cookie", async () => {
    mockRequestState({ isEnabled: false });

    const { GET } = await import("./route");
    const response = await GET();

    expect(response.status).toBe(401);
    expect(enable).not.toHaveBeenCalled();
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("returns 401 without enabling draft mode for a forged draft cookie", async () => {
    mockRequestState({ isEnabled: false, cookieValue: "forged" });

    const { GET } = await import("./route");
    const response = await GET();

    expect(response.status).toBe(401);
    expect(enable).not.toHaveBeenCalled();
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("refreshes the partitioned cookie for a valid draft session", async () => {
    mockRequestState({ isEnabled: true, cookieValue: "preview-mode-id" });

    const { GET } = await import("./route");
    const response = await GET();
    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(200);
    expect(enable).toHaveBeenCalledOnce();
    expect(setCookie).toContain("__prerender_bypass=preview-mode-id");
    expect(setCookie.toLowerCase()).toContain("partitioned");
  });
});

import crypto from "node:crypto";
import { environment } from "@/environment";

const ROOT_PATH = "/";
const TOKEN_MAX_AGE_SECONDS = 3600;

export const getSafeReturnTo = (returnTo: string | null): string => {
  if (!returnTo) {
    return ROOT_PATH;
  }

  if (returnTo.startsWith("//")) {
    return ROOT_PATH;
  }

  const normalized = returnTo.startsWith("/") ? returnTo : `/${returnTo}`;
  return normalized || ROOT_PATH;
};

export const getStoryblokToken = (
  searchParams: URLSearchParams,
): { spaceId: string; token: string; timestamp: string } | null => {
  const spaceId = searchParams.get("_storyblok_tk[space_id]");
  const token = searchParams.get("_storyblok_tk[token]");
  const timestamp = searchParams.get("_storyblok_tk[timestamp]");

  if (!spaceId || !token || !timestamp) {
    return null;
  }

  return { spaceId, token, timestamp };
};

export const isValidStoryblokToken = (tk: {
  spaceId: string;
  token: string;
  timestamp: string;
}): boolean => {
  if (tk.spaceId !== environment.STORYBLOK_SPACE_ID) {
    return false;
  }

  const timestampSeconds = Number(tk.timestamp);
  if (Number.isNaN(timestampSeconds)) {
    return false;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (nowSeconds - timestampSeconds > TOKEN_MAX_AGE_SECONDS) {
    return false;
  }

  const validationString = `${tk.spaceId}:${environment.STORYBLOK_ACCESS_TOKEN}:${tk.timestamp}`;
  const expectedToken = crypto
    .createHash("sha1")
    .update(validationString)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(tk.token),
    Buffer.from(expectedToken),
  );
};

export const stripStoryblokParams = (
  params: URLSearchParams,
): URLSearchParams => {
  const cleaned = new URLSearchParams(params);
  for (const key of [...cleaned.keys()]) {
    if (key.startsWith("_storyblok_tk[")) {
      cleaned.delete(key);
    }
  }
  cleaned.delete("returnTo");
  return cleaned;
};

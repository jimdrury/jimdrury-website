import crypto from "node:crypto";
import { environment } from "@/environment";

const ROOT_PATH = "/";
const TOKEN_MAX_AGE_SECONDS = 3600;
const BACKSLASH_CHAR_CODE = 92;
const AT_CHAR_CODE = 64;
const DEL_CHAR_CODE = 127;

const containsDisallowedReturnToChars = (value: string): boolean => {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (
      code < 32 ||
      code === DEL_CHAR_CODE ||
      code === BACKSLASH_CHAR_CODE ||
      code === AT_CHAR_CODE
    ) {
      return true;
    }
  }

  return false;
};

export const getSafeReturnTo = (
  returnTo: string | null,
  requestOrigin: string,
): string => {
  if (!returnTo) {
    return ROOT_PATH;
  }

  if (containsDisallowedReturnToChars(returnTo)) {
    return ROOT_PATH;
  }

  try {
    const url = new URL(returnTo, requestOrigin);

    if (url.origin !== requestOrigin) {
      return ROOT_PATH;
    }

    if (
      !url.pathname.startsWith("/") ||
      containsDisallowedReturnToChars(url.pathname)
    ) {
      return ROOT_PATH;
    }

    return url.pathname;
  } catch {
    return ROOT_PATH;
  }
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
  const actualTokenBuffer = Buffer.from(tk.token);
  const expectedTokenBuffer = Buffer.from(expectedToken);

  if (actualTokenBuffer.length !== expectedTokenBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(actualTokenBuffer, expectedTokenBuffer);
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

import "server-only";

export class StoryblokUnavailableError extends Error {
  readonly status: number | undefined;
  readonly slug: string;
  readonly version: "draft" | "published";

  constructor({
    message,
    status,
    slug,
    version,
    cause,
  }: {
    message: string;
    status: number | undefined;
    slug: string;
    version: "draft" | "published";
    cause: unknown;
  }) {
    super(message, { cause });
    this.name = "StoryblokUnavailableError";
    this.status = status;
    this.slug = slug;
    this.version = version;
  }
}

type StoryblokErrorClassification = "not-found" | "unavailable";

const getNumericStatus = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return undefined;
};

export const getStoryblokErrorStatus = (error: unknown): number | undefined => {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  const record = error as Record<string, unknown>;
  const direct =
    getNumericStatus(record.status) ?? getNumericStatus(record.statusCode);
  if (direct !== undefined) {
    return direct;
  }

  if (typeof record.response === "object" && record.response !== null) {
    const response = record.response as Record<string, unknown>;
    return (
      getNumericStatus(response.status) ?? getNumericStatus(response.statusCode)
    );
  }

  return undefined;
};

export const classifyStoryblokError = (
  error: unknown,
): StoryblokErrorClassification => {
  const status = getStoryblokErrorStatus(error);

  switch (status) {
    case 404:
      return "not-found";
    default:
      return "unavailable";
  }
};

export const mapStoryblokFetchError = (
  error: unknown,
  context: { slug: string; version: "draft" | "published" },
): null => {
  const status = getStoryblokErrorStatus(error);
  const classification = classifyStoryblokError(error);

  switch (classification) {
    case "not-found":
      return null;
    case "unavailable": {
      console.error("Storyblok request failed", {
        slug: context.slug,
        version: context.version,
        status: status ?? "unknown",
      });

      throw new StoryblokUnavailableError({
        message: `Storyblok request failed for ${context.slug} (${context.version})`,
        status,
        slug: context.slug,
        version: context.version,
        cause: error,
      });
    }
    default: {
      const exhaustive: never = classification;
      throw new Error(
        `Unhandled Storyblok error classification: ${exhaustive}`,
      );
    }
  }
};

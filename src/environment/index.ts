import "server-only";
import { z } from "zod";

const environmentSchema = z.object({
  STORYBLOK_ACCESS_TOKEN: z.string().min(1),
  STORYBLOK_SPACE_ID: z.string().min(1),
  INDEXNOW_KEY: z.string().min(1).optional(),
  STORYBLOK_WEBHOOK_SECRET: z.string().min(1).optional(),
});

export const environment = environmentSchema.parse(process.env);

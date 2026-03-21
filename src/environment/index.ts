import "server-only";
import { z } from "zod";

const environmentSchema = z.object({
  STORYBLOK_ACCESS_TOKEN: z.string().min(1),
});

export const environment = environmentSchema.parse(process.env);

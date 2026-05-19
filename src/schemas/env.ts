import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().default(1234),
  DATABASE_URL: z.string().min(1),
  EMAIL_HOST: z.string().min(1),
  EMAIL_PORT: z.coerce.number().default(587),
  EMAIL_USER: z.string().min(1),
  EMAIL_PASSWORD: z.string().min(1),
  EMAIL_TO: z.string().email(),
  API_AUTH_KEY: z.string().min(32),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});
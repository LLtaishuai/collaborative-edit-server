
import "dotenv/config";
import { envSchema } from "./schemas/env.js";

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    JSON.stringify(result.error.format(), null, 2)
  );

  process.exit(1);
}

export const env = result.data;

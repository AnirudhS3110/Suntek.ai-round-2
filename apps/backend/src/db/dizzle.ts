import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "src/config/env";

const queryClient = postgres(env.databaseUrl);

export const db = drizzle(queryClient);
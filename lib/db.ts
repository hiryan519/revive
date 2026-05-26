import postgres from "postgres";
import { getEnv } from "@/lib/env";

const globalForDb = globalThis as typeof globalThis & {
  reviveSql?: postgres.Sql;
};

export function getDb() {
  if (!globalForDb.reviveSql) {
    globalForDb.reviveSql = postgres(getEnv().DATABASE_URL, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 15,
      prepare: false,
    });
  }

  return globalForDb.reviveSql;
}

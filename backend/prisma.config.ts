// Use a config file that can be dynamic
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.VERCEL ? "file:/tmp/dev.db" : "file:./dev.db",
  },
});

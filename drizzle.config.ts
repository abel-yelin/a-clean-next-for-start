import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: "./src/server/db/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    host:'localhost',
      port:5432,
      user:'postgres',
      password:'abc123456',
      database:"postgres",
      ssl: false
  },
  verbose: true,
  strict: true,
})
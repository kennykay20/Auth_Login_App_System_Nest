import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
console.log('Using database URL:', process.env.DATABASE_URL);

export default defineConfig({
  schema: './src/Infrastructure/Persistence/Db/schema.ts',
  out: './src/Infrastructure/Persistence/Migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

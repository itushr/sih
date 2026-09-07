import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error(`    >> Error  :: Missing env variable : DATABASE_URL`);
  console.log(`    >> INTEROP CORE IS TERMINATED!\n`);

  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
});

export default pool;
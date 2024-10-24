import { config } from "dotenv";
import pg from "pg";

config();

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env;

const { Pool } = pg;
const db = new Pool({
  user: DB_USER ?? "postgres",
  password: DB_PASS ?? "root",
  host: DB_HOST ?? "localhost",
  port: DB_PORT ?? 5432,
  database: DB_NAME ?? "sales_equipment",
});

export default db;

import pg from "pg";

const { Pool } = pg;
const db = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  port: 5432,
  database: "sales_equipment",
});

export default db;

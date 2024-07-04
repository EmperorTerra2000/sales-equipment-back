import pg from "pg";

const { Pool } = pg;
const db = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  port: 5432,
  database: "product",
});

export default db;

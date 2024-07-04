import pg from "pg";

const { Pool } = pg;
const db = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  port: 5432,
  database: "products",
});

export default db;

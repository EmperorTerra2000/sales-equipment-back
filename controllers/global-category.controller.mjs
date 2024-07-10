import db from "../src/db.mjs";

class GlobalCategoryController {
  async create(req, res) {
    const { name, code } = req.body;

    const newData = await db.query(
      `INSERT INTO global_category (code, name) values ($1, $2) RETURNING *`,
      [code, name]
    );
    console.log(req.body);

    res.json(newData.rows[0]);
  }
  async get(req, res) {
    const data = await db.query("SELECT * FROM global_category");

    res.json(data.rows);
  }
  async getOne(req, res) {
    const id = req.params.id;
    const data = await db.query("SELECT * FROM global_category where id = $1", [
      id,
    ]);

    res.json(data.rows[0]);
  }
  async update(req, res) {
    const { name, code, id } = req.body;
    const data = await db.query(
      "UPDATE global_category set name = $1, code = $2 where id = $3 RETURNING *",
      [name, code, id]
    );

    res.json(data.rows[0]);
  }
  async delete(req, res) {
    const id = req.params.id;
    const data = await db.query("DELETE FROM global_category where id = $1", [
      id,
    ]);

    res.json(data.rows[0]);
  }
}

export default new GlobalCategoryController();

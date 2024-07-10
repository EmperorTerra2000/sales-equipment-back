import db from "../src/db.mjs";

class CategoryController {
  async createCategory(req, res) {
    const { name, code } = req.body;

    const newCategory = await db.query(
      `INSERT INTO category (code, name) values ($1, $2) RETURNING *`,
      [code, name]
    );
    console.log(req.body);

    res.json(newCategory.rows[0]);
  }
  async getCategory(req, res) {
    const categories = await db.query("SELECT * FROM category");

    res.json(categories.rows);
  }
  async getOneCategory(req, res) {
    const id = req.params.id;
    const category = await db.query("SELECT * FROM category where id = $1", [
      id,
    ]);

    res.json(category.rows[0]);
  }
  async updateCategory(req, res) {
    const { name, code, id } = req.body;
    const category = await db.query(
      "UPDATE category set name = $1, code = $2 where id = $3 RETURNING *",
      [name, code, id]
    );

    res.json(category.rows[0]);
  }
  async deleteCategory(req, res) {
    const id = req.params.id;
    const category = await db.query("DELETE FROM category where id = $1", [id]);

    res.json(category.rows[0]);
  }
}

export default new CategoryController();

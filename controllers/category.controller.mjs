import db from "../src/db.mjs";

class categoryController {
  async createCategory(req, res) {
    const { name, code } = req.body;

    const newCategory = await db.query(
      `INSERT INTO category (code, name) values ($1, $2) RETURNING *`,
      [code, name]
    );
    console.log(req.body);

    res.json(newCategory.rows[0]);
  }
  async getCategory(req, res) {}
  async getOneCategory(req, res) {}
  async updateCategory(req, res) {}
  async deleteCategory(req, res) {}
}

export default new categoryController();

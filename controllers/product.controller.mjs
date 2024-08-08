import sharp from "sharp";
import * as path from "path";
import db from "../src/db.mjs";
import {
  formatDate,
  transliterate,
} from "../utils/helpers/formatter.helpers.mjs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootPath = path.resolve(__dirname, "..");

class ProductController {
  async create(req, res) {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      const { name, companyId, description, specifications } = req.body;
      const { path: tempPath, filename } = req.file;

      console.log(specifications);

      const targetPath = path.join(__rootPath, `uploads/products/${filename}`);
      await sharp(tempPath).toFile(targetPath);
      const latinText = transliterate(name.trim());
      const newData = await db.query(
        `INSERT INTO products (name, created_at, image, name_en, description, companies_id, specifications) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          name.trim(),
          formatDate(new Date()),
          filename,
          latinText,
          description,
          companyId,
          !specifications ? null : JSON.stringify(specifications),
        ]
      );

      res.json(newData.rows[0]);
    } catch (err) {
      res.json({
        error: {
          message: err.message,
        },
      });
      console.error(err);
    }
  }
  async get(req, res) {
    try {
      // Выполнение запроса к базе данных
      const data = await db.query("SELECT * FROM products");

      // Проверка наличия данных
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }

      data.rows = data.rows.map((item) => ({
        ...item,
        image: `http://127.0.0.1/uploads/products/${item.image}`,
      }));

      // Отправка данных в ответе
      res.json(data.rows);
    } catch (error) {
      // Обработка ошибок
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async getOneName(req, res) {
    try {
      const name = req.params.name;

      // Проверка наличия параметра
      if (!name) {
        return res.status(400).json({ error: "name is required" });
      }

      // Выполнение запроса к базе данных
      const data = await db.query("SELECT * FROM products WHERE name_en = $1", [
        name,
      ]);

      // Проверка наличия данных
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      // Отправка данных в ответе
      res.json(data.rows[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  }
  async getCompanyId(req, res) {
    try {
      const id = req.params.id;
      const data = await db.query(
        "SELECT * FROM products where companies_id = $1",
        [id]
      );

      // Проверка наличия данных
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }

      data.rows = data.rows.map((item) => ({
        ...item,
        image: `http://127.0.0.1/uploads/category/${item.image}`,
      }));

      // Отправка данных в ответе
      res.json(data.rows);
    } catch (error) {
      // Обработка ошибок
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async getOne(req, res) {
    const id = req.params.id;
    const category = await db.query("SELECT * FROM category where id = $1", [
      id,
    ]);

    res.json(category.rows[0]);
  }
  async update(req, res) {
    const { name, code, id } = req.body;
    const category = await db.query(
      "UPDATE category set name = $1, code = $2 where id = $3 RETURNING *",
      [name, code, id]
    );

    res.json(category.rows[0]);
  }
  async delete(req, res) {
    const id = req.params.id;
    const category = await db.query("DELETE FROM category where id = $1", [id]);

    res.json(category.rows[0]);
  }
}

export default new ProductController();

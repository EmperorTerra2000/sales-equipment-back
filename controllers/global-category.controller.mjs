import db from "../src/db.mjs";
import * as path from "path";
import { transliterate } from "transliteration";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { formatDate } from "../utils/helpers/formatter.helpers.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootPath = path.resolve(__dirname, "..");

class GlobalCategoryController {
  async create(req, res) {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      const { name } = req.body;
      const { path: tempPath, originalname, filename } = req.file;

      const targetPath = path.join(
        __rootPath,
        `uploads/global_category/${filename}`
      );

      // const targetPathDeleteFile = path.join(__rootPath, `uploads/${filename}`);

      await sharp(tempPath).toFile(targetPath);

      // if (fs.existsSync(tempPath)) {
      //   await fs.unlink(tempPath, (err) => {
      //     if (err) throw err;
      //     console.log("path/file.txt was deleted");
      //   });
      // }

      const latinText = transliterate(name).toLowerCase().trim();

      const newData = await db.query(
        `INSERT INTO global_category (name, created_at, image, name_en) values ($1, $2, $3, $4) RETURNING *`,
        [name.trim(), formatDate(new Date()), filename, latinText]
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
      const data = await db.query("SELECT * FROM global_category");

      // Проверка наличия данных
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }

      data.rows = data.rows.map((item) => ({
        ...item,
        image: `http://127.0.0.1/uploads/global_category/${item.image}`,
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
    try {
      const id = req.params.id;

      // Проверка наличия параметра `id`
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      // Выполнение запроса к базе данных
      const data = await db.query(
        "SELECT * FROM global_category WHERE id = $1",
        [id]
      );

      // Проверка наличия данных
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      console.log(data.rows);

      // Отправка данных в ответе
      res.json(data.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
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

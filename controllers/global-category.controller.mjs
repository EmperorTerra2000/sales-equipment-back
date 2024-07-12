import db from "../src/db.mjs";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { formatDate } from "../utils/helpers/formatter.helpers.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootPath = path.resolve(__dirname, "..");

class GlobalCategoryController {
  async create(req, res) {
    try {
      const { name } = req.body;
      const { path: tempPath, originalname, filename } = req.file;

      const targetPath = path.join(
        __rootPath,
        `uploads/global_category/${originalname}`
      );

      const targetPathDeleteFile = path.join(__rootPath, `uploads/${filename}`);

      await sharp(tempPath).toFile(targetPath);
      fs.unlinkSync(targetPathDeleteFile);

      const newData = await db.query(
        `INSERT INTO global_category (name, created_at, image) values ($1, $2, $3) RETURNING *`,
        [name, formatDate(new Date()), originalname]
      );

      res.json(newData.rows[0]);
    } catch (err) {
      console.error(err);
    }
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

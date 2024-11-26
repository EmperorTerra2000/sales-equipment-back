import sharp from "sharp";
import * as path from "path";
import db from "../src/db.mjs";
import {
  formatDate,
  transliterate,
} from "../utils/helpers/formatter.helpers.mjs";
import { fileURLToPath } from "url";
import { URL_HOST } from "../src/app.mjs";
import {
  deleteFile,
  downloadFile,
  downloadFileHttps,
  downloadFileV2,
} from "../utils/helpers/action.helpers.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootPath = path.resolve(__dirname, "..");

class CompanyController {
  #NAME_TABLE = "companies";

  create = async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      const { name, categories, global_categories, description } = req.body;
      const { path: tempPath, originalname, filename } = req.file;

      const targetPath = path.join(__rootPath, `uploads/companies/${filename}`);
      await sharp(tempPath).toFile(targetPath);
      await deleteFile(tempPath);
      const latinText = transliterate(name.trim());
      const newData = await db.query(
        `INSERT INTO ${
          this.#NAME_TABLE
        } (name, created_at, image, name_en, categories, global_categories, description) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          name.trim(),
          formatDate(new Date()),
          filename,
          latinText,
          categories,
          global_categories,
          description,
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
  };
  createUrlImage = async (req, res) => {
    try {
      const { name, image_url, categories, global_categories, description } =
        req.body;
      const dataImage = {};

      const filename = await downloadFileHttps(image_url);
      await downloadFileV2(dataImage, filename, "companies");

      const latinText = transliterate(name.trim());

      const newData = await db.query(
        `INSERT INTO ${
          this.#NAME_TABLE
        } (name, created_at, image, name_en, categories, global_categories, description) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          name.trim(),
          formatDate(new Date()),
          filename,
          latinText,
          categories,
          global_categories,
          description,
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
  };
  get = async (req, res) => {
    try {
      // Выполнение запроса к базе данных
      const data = await db.query(`SELECT * FROM ${this.#NAME_TABLE}`);

      // Проверка наличия данных
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }

      data.rows = data.rows.map((item) => ({
        ...item,
        image: `${URL_HOST}/uploads/companies/${item.image}`,
      }));

      // Отправка данных в ответе
      res.json(data.rows);
    } catch (error) {
      // Обработка ошибок
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  getOneName = async (req, res) => {
    try {
      const name = req.params.name;

      // Проверка наличия параметра
      if (!name) {
        return res.status(400).json({ error: "name is required" });
      }

      // Выполнение запроса к базе данных
      const data = await db.query(
        `SELECT * FROM ${this.#NAME_TABLE} WHERE name_en = $1`,
        [name]
      );

      // Проверка наличия данных
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      data.rows = data.rows.map((item) => ({
        ...item,
        image: `${URL_HOST}/uploads/companies/${item.image}`,
      }));

      const getGlobalCategories = async (categories) => {
        for(let i = 0; i < categories.length; i++) {
          const globalCategories = await db.query(
            `SELECT * FROM global_category WHERE id = $1`,
            [categories[i].global_category_id]
          );

          categories[i].global_category = globalCategories.rows[0];
        }
      }

      if (
        Array.isArray(data.rows[0].categories) &&
        data.rows[0].categories.length > 0
      ) {
        const categories = await db.query(
          `SELECT * FROM category WHERE id = ANY($1::int[])`,
          [data.rows[0].categories]
        );

        await getGlobalCategories(categories.rows);

        data.rows[0].categories = categories.rows.map((item) => ({
          ...item,
          image: `${URL_HOST}/uploads/category/${item.image}`,
        }));
      }

      // Отправка данных в ответе
      res.json(data.rows[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  };
  getCategoryId = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await db.query(
        `SELECT * FROM ${this.#NAME_TABLE} where $1 = ANY(categories)`,
        [id]
      );

      // Проверка наличия данных
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }

      data.rows = data.rows.map((item) => ({
        ...item,
        image: `${URL_HOST}/uploads/companies/${item.image}`,
      }));

      // Отправка данных в ответе
      res.json(data.rows);
    } catch (error) {
      // Обработка ошибок
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  getGlobalCategoryId = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await db.query(
        `SELECT * FROM ${this.#NAME_TABLE} where $1 = ANY(global_categories)`,
        [id]
      );

      // Проверка наличия данных
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }

      data.rows = data.rows.map((item) => ({
        ...item,
        image: `${URL_HOST}/uploads/companies/${item.image}`,
      }));

      // Отправка данных в ответе
      res.json(data.rows);
    } catch (error) {
      // Обработка ошибок
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  getOne = async (req, res) => {
    const id = req.params.id;
    const category = await db.query(
      `SELECT * FROM ${this.#NAME_TABLE} where id = $1`,
      [id]
    );

    res.json(category.rows[0]);
  };
  update = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (updates.name) {
      updates.name_en = transliterate(updates.name.trim());
    }

    await downloadFile(req, updates, "companies");

    // Создание SQL-запроса для обновления данных
    const updateQuery = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const values = Object.values(updates);
    values.push(id);

    const query = `UPDATE ${this.#NAME_TABLE} SET ${updateQuery} WHERE id = $${
      values.length
    }`;

    try {
      const data = await db.query(query, values);
      res.status(200).send({ message: "Item updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Failed to update item" });
    }
  };
  delete = async (req, res) => {
    const id = req.params.id;
    const category = await db.query(
      `DELETE FROM ${this.#NAME_TABLE} where id = $1`,
      [id]
    );

    res.json(category.rows[0]);
  };
  activity = async (req, res) => {
    try {
      const id = req.params.id;
      const { activity } = req.body;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      await db.query(
        `UPDATE ${this.#NAME_TABLE} SET active = $1 WHERE id = $2`,
        [activity, id]
      );

      res.json("success");
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  };
}

export default new CompanyController();

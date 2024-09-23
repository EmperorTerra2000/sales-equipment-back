import db from "../src/db.mjs";
import {
  formatDate,
  transliterate,
} from "../utils/helpers/formatter.helpers.mjs";
import { downloadFile } from "../utils/helpers/action.helpers.mjs";
import { URL_HOST } from "../src/app.mjs";

class CategoryController {
  #NAME_TABLE = "category";

  create = async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      const { name, globalCatId } = req.body;
      const dataImage = {};

      await downloadFile(req, dataImage, "category");

      const latinText = transliterate(name.trim());
      const newData = await db.query(
        `INSERT INTO ${
          this.#NAME_TABLE
        } (name, created_at, image, name_en, global_category_id) values ($1, $2, $3, $4, $5) RETURNING *`,
        [
          name.trim(),
          formatDate(new Date()),
          dataImage.image,
          latinText,
          globalCatId,
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
      const data = await db.query(
        `SELECT * FROM ${this.#NAME_TABLE} WHERE active = true`
      );

      // Проверка наличия данных
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }

      data.rows = data.rows.map((item) => ({
        ...item,
        image: `${URL_HOST}/uploads/category/${item.image}`,
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

      // Проверка наличия параметра `id`
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

      // Отправка данных в ответе
      res.json({
        data: data.rows[0],
        meta: {},
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  };
  getGlobalId = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await db.query(
        `SELECT * FROM ${this.#NAME_TABLE} where global_category_id = $1`,
        [id]
      );

      // Проверка наличия данных
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }

      data.rows = data.rows.map((item) => ({
        ...item,
        image: `${URL_HOST}/uploads/category/${item.image}`,
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

    await downloadFile(req, updates, "category");

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

export default new CategoryController();

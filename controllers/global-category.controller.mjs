import db from "../src/db.mjs";

import {
  formatDate,
  transliterate,
} from "../utils/helpers/formatter.helpers.mjs";
import { URL_HOST } from "../src/app.mjs";
import {
  downloadFile,
  downloadFileHttps,
  downloadFileV2,
} from "../utils/helpers/action.helpers.mjs";

class GlobalCategoryController {
  #NAME_TABLE = "global_category";

  create = async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      const { name } = req.body;
      const dataImage = {};

      await downloadFile(req, dataImage, "global_category");

      const latinText = transliterate(name.trim());

      const newData = await db.query(
        `INSERT INTO ${
          this.#NAME_TABLE
        } (name, created_at, image, name_en) values ($1, $2, $3, $4) RETURNING *`,
        [name.trim(), formatDate(new Date()), dataImage.image, latinText]
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
    const { image_url } = req.body;

    try {
      const dataImage = {};

      const filename = await downloadFileHttps(image_url);
      await downloadFileV2(dataImage, filename, "companies");

      res.send("end");
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
        image: `${URL_HOST}/uploads/global_category/${item.image}`,
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
    try {
      const id = req.params.id;

      // Проверка наличия параметра `id`
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      // Выполнение запроса к базе данных
      const data = await db.query(
        `SELECT * FROM ${this.#NAME_TABLE} WHERE id = $1`,
        [id]
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
  update = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (updates.name) {
      updates.name_en = transliterate(updates.name.trim());
    }

    await downloadFile(req, updates, "global_category");

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
    const data = await db.query(
      `DELETE FROM ${this.#NAME_TABLE} where id = $1`,
      [id]
    );

    res.json(data.rows[0]);
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

export default new GlobalCategoryController();

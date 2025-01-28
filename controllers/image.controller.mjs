import db from "../src/db.mjs";
import { formatDate } from "../utils/helpers/formatter.helpers.mjs";
import { downloadFile } from "../utils/helpers/action.helpers.mjs";
import { URL_HOST } from "../src/app.mjs";

class ImageController {
  #NAME_TABLE = "images";

  create = async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      const dataImage = {};

      await downloadFile(req, dataImage, "images");

      const newData = await db.query(
        `INSERT INTO ${
          this.#NAME_TABLE
        } (name, created_at) values ($1, $2) RETURNING *`,
        [dataImage.image, formatDate(new Date())]
      );

      res.json({
        data: {
          image: `${URL_HOST}/uploads/images/${dataImage.image}`,
        },
      });
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
        name: `${URL_HOST}/uploads/images/${item.name}`,
      }));

      // Отправка данных в ответе
      res.json(data.rows);
    } catch (error) {
      // Обработка ошибок
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default new ImageController();

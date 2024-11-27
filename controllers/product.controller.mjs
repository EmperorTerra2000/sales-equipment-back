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

class ProductController {
  #NAME_TABLE = "products";

  create = async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      const { name, categoryId, description, specifications, metadata_desc } = req.body;
      const dataImage = {};

      await downloadFile(req, dataImage, "products");

      const latinText = transliterate(name.trim());
      const newData = await db.query(
        `INSERT INTO ${
          this.#NAME_TABLE
        } (name, created_at, image, name_en, description, category_id, specifications, metadata_desc) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          name.trim(),
          formatDate(new Date()),
          dataImage.image,
          latinText,
          description,
          categoryId,
          !specifications ? null : JSON.stringify(specifications),
          metadata_desc
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
      const { name, categoryId, description, specifications, image_url } =
        req.body;
      const dataImage = {};

      const filename = await downloadFileHttps(image_url);
      await downloadFileV2(dataImage, filename, "products");

      const latinText = transliterate(name.trim());

      const newData = await db.query(
        `INSERT INTO ${
          this.#NAME_TABLE
        } (name, created_at, image, name_en, description, category_id, specifications) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          name.trim(),
          formatDate(new Date()),
          filename,
          latinText,
          description,
          categoryId,
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
        image: `${URL_HOST}/uploads/products/${item.image}`,
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
        image: `${URL_HOST}/uploads/products/${item.image}`,
      }));

      // Отправка данных в ответе
      res.json(data.rows[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  };
  getCompanyId = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await db.query(
        `SELECT * FROM ${this.#NAME_TABLE} where companies_id = $1`,
        [id]
      );

      const dataCompany = await db.query(
        "SELECT * FROM companies where id = $1",
        [id]
      );

      // Проверка наличия данных
      if (dataCompany.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }
      // Проверка наличия данных
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }

      data.rows = data.rows.map((item) => ({
        ...item,
        image: `${URL_HOST}/uploads/products/${item.image}`,
      }));

      // Отправка данных в ответе
      res.json({
        company: {
          name: dataCompany.rows[0].name,
          name_en: dataCompany.rows[0].name_en,
        },
        data: data.rows,
      });
    } catch (error) {
      // Обработка ошибок
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  getList = async (req, res) => {
    try {
      const { nameCategory } = req.params;
      let global_cat = null;
      let products = [];
      let category = null;

      if (!nameCategory) {
        return res.status(400).json({ error: "name is required" });
      }

      const dataCategory = await db.query(
        `SELECT * FROM category WHERE name_en = $1`,
        [nameCategory]
      );

      // Проверка наличия данных
      if (dataCategory.rows.length === 0) {
        category = null;
      } else if (dataCategory.rows.length > 0){
        category = {
          ...dataCategory.rows[0],
          image: `${URL_HOST}/uploads/category/${dataCategory.rows[0].image}`,
        };
      }

      const dataProducts = await db.query(
        `SELECT * FROM ${this.#NAME_TABLE} where category_id = $1`,
        [dataCategory.rows[0].id]
      );

      if (dataProducts.rows.length === 0) {
        products = [];
      } else if (dataProducts.rows.length > 0) {
        products = dataProducts.rows.map((item) => ({
          ...item,
          image: `${URL_HOST}/uploads/products/${item.image}`,
        }));
      } else {
        products = null;
      }

      const dataGlobalCategory = await db.query(
        "SELECT * FROM global_category where id = $1",
        [dataCategory.rows[0].global_category_id]
      );

      // Проверка наличия данных
      if (dataGlobalCategory.rows.length === 0) {
        global_cat = null;
      } else if (dataGlobalCategory.rows.length > 0) {
        global_cat = {
          name: dataGlobalCategory.rows[0].name,
          name_en: dataGlobalCategory.rows[0].name_en,
        };
      }

      // Отправка данных в ответе
      res.json({
        global_cat,
        products,
        category,
      });
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
    const { name, code, id } = req.body;
    const category = await db.query(
      `UPDATE ${
        this.#NAME_TABLE
      } set name = $1, code = $2 where id = $3 RETURNING *`,
      [name, code, id]
    );

    res.json(category.rows[0]);
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

export default new ProductController();

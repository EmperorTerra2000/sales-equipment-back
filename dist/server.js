var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.mjs
var app_exports = {};
__export(app_exports, {
  URL_HOST: () => URL_HOST
});
module.exports = __toCommonJS(app_exports);
var import_dotenv4 = require("dotenv");
var import_express8 = __toESM(require("express"), 1);
var import_body_parser = __toESM(require("body-parser"), 1);
var import_cookie_parser = __toESM(require("cookie-parser"), 1);
var import_celebrate6 = require("celebrate");

// errors/not-found-error.mjs
var NotFoundError = class extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
};
var not_found_error_default = NotFoundError;

// middlewares/cors.mjs
var allowedCors = [
  "https://movies.praktikum.nomoredomains.work",
  "http://movies.praktikum.nomoredomains.work",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "https://idlepshokoff.com"
];
var cors = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
  const requestHeaders = req.headers["access-control-request-headers"];
  if (allowedCors.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    if (method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
      res.header("Access-Control-Allow-Headers", requestHeaders);
      return res.end();
    }
  }
  return next();
};
var cors_default = cors;

// middlewares/logger.mjs
var import_winston = __toESM(require("winston"), 1);
var import_express_winston = __toESM(require("express-winston"), 1);
var requestLogger = import_express_winston.default.logger({
  transports: [new import_winston.default.transports.File({ filename: "request.log" })],
  format: import_winston.default.format.json()
});
var errorLogger = import_express_winston.default.errorLogger({
  transports: [new import_winston.default.transports.File({ filename: "error.log" })],
  format: import_winston.default.format.json()
});

// routes/category.routes.mjs
var import_express = __toESM(require("express"), 1);
var import_celebrate = require("celebrate");
var import_multer = __toESM(require("multer"), 1);
var path2 = __toESM(require("path"), 1);

// src/db.mjs
var import_dotenv = require("dotenv");
var import_pg = __toESM(require("pg"), 1);
(0, import_dotenv.config)();
var { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env;
var { Pool } = import_pg.default;
var db = new Pool({
  user: DB_USER ?? "postgres",
  password: DB_PASS ?? "root",
  host: DB_HOST ?? "localhost",
  port: DB_PORT ?? 5432,
  database: DB_NAME ?? "sales_equipment"
});
var db_default = db;

// utils/helpers/formatter.helpers.mjs
var import_transliteration = require("transliteration");
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
function transliterate(text) {
  return (0, import_transliteration.transliterate)(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function getNameAndFormatImage(url) {
  const parts = url.split("/");
  const fileNameWithExtension = parts[parts.length - 1];
  return fileNameWithExtension.split(".");
}

// utils/helpers/action.helpers.mjs
var fs = __toESM(require("fs"), 1);
var path = __toESM(require("path"), 1);
var import_sharp = __toESM(require("sharp"), 1);
var https = __toESM(require("https"), 1);
var __rootPath = process.cwd();
async function deleteFile(tempPath) {
  if (fs.existsSync(tempPath)) {
    await fs.unlink(tempPath, (err) => {
      if (err) throw err;
    });
  }
}
async function downloadFile(req, data, pathName) {
  if (!req.file) {
    return;
  }
  try {
    const { path: tempPath, originalname, filename } = req.file;
    const targetPath = path.join(__rootPath, `uploads/${pathName}/${filename}`);
    await (0, import_sharp.default)(tempPath).toFile(targetPath);
    await deleteFile(tempPath);
    data.image = filename;
  } catch (err) {
    console.error(err);
  }
}
async function downloadFileV2(data, filename, pathName) {
  try {
    const tempPath = path.join(__rootPath, `uploads/${filename}`);
    const targetPath = path.join(__rootPath, `uploads/${pathName}/${filename}`);
    await (0, import_sharp.default)(tempPath).toFile(targetPath);
    await deleteFile(tempPath);
    data.image = filename;
  } catch (err) {
    console.error(err);
  }
}
async function downloadFileHttps(imageUrl) {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (response) => {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        const [_, fileExtension] = getNameAndFormatImage(response.req.path);
        const nameFile = `${Date.now()}.${fileExtension}`;
        const savePath = `./uploads/${nameFile}`;
        const fileStream = fs.createWriteStream(savePath);
        response.pipe(fileStream);
        fileStream.on("finish", () => {
          fileStream.close();
          resolve(nameFile);
        });
      } else {
        console.error(
          `\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F: ${response.statusCode}`
        );
        reject(
          new Error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F: ${response.statusCode}`)
        );
      }
    }).on("error", (err) => {
      console.error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F: ${err.message}`);
      reject(new Error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F: ${err.message}`));
    });
  });
}

// controllers/category.controller.mjs
var CategoryController = class {
  #NAME_TABLE = "category";
  create = async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    try {
      const { name, globalCatId, description } = req.body;
      const dataImage = {};
      await downloadFile(req, dataImage, "category");
      const latinText = transliterate(name.trim());
      const newData = await db_default.query(
        `INSERT INTO ${this.#NAME_TABLE} (name, created_at, image, name_en, global_category_id, description) values ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          name.trim(),
          formatDate(/* @__PURE__ */ new Date()),
          dataImage.image,
          latinText,
          globalCatId,
          !description ? null : description
        ]
      );
      res.json(newData.rows[0]);
    } catch (err) {
      res.json({
        error: {
          message: err.message
        }
      });
      console.error(err);
    }
  };
  createUrlImage = async (req, res) => {
    try {
      const { name, image_url, globalCatId, description } = req.body;
      const dataImage = {};
      const filename = await downloadFileHttps(image_url);
      await downloadFileV2(dataImage, filename, "category");
      const latinText = transliterate(name.trim());
      const newData = await db_default.query(
        `INSERT INTO ${this.#NAME_TABLE} (name, created_at, image, name_en, global_category_id, description) values ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          name.trim(),
          formatDate(/* @__PURE__ */ new Date()),
          dataImage.image,
          latinText,
          globalCatId,
          !description ? null : description
        ]
      );
      res.json(newData.rows[0]);
    } catch (err) {
      res.json({
        error: {
          message: err.message
        }
      });
      console.error(err);
    }
  };
  get = async (req, res) => {
    try {
      const data = await db_default.query(
        `SELECT * FROM ${this.#NAME_TABLE} WHERE active = true`
      );
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }
      data.rows = data.rows.map((item) => ({
        ...item,
        image: `${URL_HOST}/uploads/category/${item.image}`
      }));
      res.json(data.rows);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  getOneName = async (req, res) => {
    try {
      const name = req.params.name;
      if (!name) {
        return res.status(400).json({ error: "name is required" });
      }
      const data = await db_default.query(
        `SELECT * FROM ${this.#NAME_TABLE} WHERE name_en = $1`,
        [name]
      );
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json({
        data: data.rows[0],
        meta: {}
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  };
  getGlobalId = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await db_default.query(
        `SELECT * FROM ${this.#NAME_TABLE} where global_category_id = $1 AND active = true`,
        [id]
      );
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }
      data.rows = data.rows.map((item) => ({
        ...item,
        image: `${URL_HOST}/uploads/category/${item.image}`
      }));
      res.json(data.rows);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  getOne = async (req, res) => {
    const id = req.params.id;
    const category = await db_default.query(
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
    const updateQuery = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(", ");
    const values = Object.values(updates);
    values.push(id);
    const query = `UPDATE ${this.#NAME_TABLE} SET ${updateQuery} WHERE id = $${values.length}`;
    try {
      const data = await db_default.query(query, values);
      res.status(200).send({ message: "Item updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Failed to update item" });
    }
  };
  delete = async (req, res) => {
    const id = req.params.id;
    const category = await db_default.query(
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
      await db_default.query(
        `UPDATE ${this.#NAME_TABLE} SET active = $1 WHERE id = $2`,
        [activity, id]
      );
      res.json("success");
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  };
  getList = async (req, res) => {
    try {
      const { nameGlobalCategory } = req.params;
      const queryObj = req.query;
      let global_cat = null;
      let category = [];
      if (!nameGlobalCategory) {
        return res.status(400).json({ error: "name is required" });
      }
      const dataGlobalCategory = await db_default.query(
        `SELECT * FROM global_category WHERE name_en = $1`,
        [nameGlobalCategory]
      );
      if (dataGlobalCategory.rows.length === 0) {
        global_cat = null;
      } else if (dataGlobalCategory.rows.length > 0) {
        global_cat = {
          ...dataGlobalCategory.rows[0],
          image: `${URL_HOST}/uploads/global_category/${dataGlobalCategory.rows[0].image}`,
          name: dataGlobalCategory.rows[0].name,
          name_en: dataGlobalCategory.rows[0].name_en
        };
      }
      const getDataCategory = async () => {
        if (queryObj.company_id) {
          const company = await db_default.query(
            `SELECT * FROM companies where id = $1`,
            [queryObj.company_id]
          );
          if (company.rows.length === 0) {
            return { rows: [] };
          }
          return db_default.query(
            `SELECT * FROM ${this.#NAME_TABLE} where global_category_id = $1 AND active = true AND id = ANY($2::int[])`,
            [dataGlobalCategory.rows[0].id, company.rows[0].categories]
          );
        }
        return db_default.query(
          `SELECT * FROM ${this.#NAME_TABLE} where global_category_id = $1 AND active = true`,
          [dataGlobalCategory.rows[0].id]
        );
      };
      const dataCategory = await getDataCategory();
      if (dataCategory.rows.length === 0) {
        category = [];
      } else if (dataCategory.rows.length > 0) {
        category = dataCategory.rows.map((item) => ({
          ...item,
          image: `${URL_HOST}/uploads/category/${item.image}`
        }));
      } else {
        category = null;
      }
      res.json({
        global_cat,
        category
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};
var category_controller_default = new CategoryController();

// routes/category.routes.mjs
var router = import_express.default.Router();
var storage = import_multer.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path2.extname(file.originalname));
  }
});
var upload = (0, import_multer.default)({ storage });
router.post("/category", upload.single("image"), category_controller_default.create);
router.post("/category/url-image", category_controller_default.createUrlImage);
router.get("/category", category_controller_default.get);
router.get("/category/:id", category_controller_default.getOne);
router.get("/category/name_en/:name", category_controller_default.getOneName);
router.get("/category/global-id/:id", category_controller_default.getGlobalId);
router.get("/category/list/:nameGlobalCategory", category_controller_default.getList);
router.put(
  "/category",
  (0, import_celebrate.celebrate)({
    [import_celebrate.Segments.BODY]: import_celebrate.Joi.object().keys({
      id: import_celebrate.Joi.number().required(),
      name: import_celebrate.Joi.string().required(),
      code: import_celebrate.Joi.number().required()
    })
  }),
  category_controller_default.update
);
router.delete("/category/:id", category_controller_default.delete);
router.patch(
  "/category/:id",
  upload.single("image"),
  category_controller_default.update
);
router.patch("/category/activity/:id", category_controller_default.activity);
var category_routes_default = router;

// routes/global-category.routes.mjs
var import_express2 = __toESM(require("express"), 1);
var import_celebrate2 = require("celebrate");
var import_multer2 = __toESM(require("multer"), 1);
var path3 = __toESM(require("path"), 1);

// controllers/global-category.controller.mjs
var GlobalCategoryController = class {
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
      const newData = await db_default.query(
        `INSERT INTO ${this.#NAME_TABLE} (name, created_at, image, name_en) values ($1, $2, $3, $4) RETURNING *`,
        [name.trim(), formatDate(/* @__PURE__ */ new Date()), dataImage.image, latinText]
      );
      res.json(newData.rows[0]);
    } catch (err) {
      res.json({
        error: {
          message: err.message
        }
      });
      console.error(err);
    }
  };
  createUrlImage = async (req, res) => {
    try {
      const { name, image_url } = req.body;
      const dataImage = {};
      const filename = await downloadFileHttps(image_url);
      await downloadFileV2(dataImage, filename, "global_category");
      const latinText = transliterate(name.trim());
      const newData = await db_default.query(
        `INSERT INTO ${this.#NAME_TABLE} (name, created_at, image, name_en) values ($1, $2, $3, $4) RETURNING *`,
        [name.trim(), formatDate(/* @__PURE__ */ new Date()), dataImage.image, latinText]
      );
      res.json(newData.rows[0]);
    } catch (err) {
      res.json({
        error: {
          message: err.message
        }
      });
      console.error(err);
    }
  };
  get = async (req, res) => {
    try {
      const data = await db_default.query(
        `SELECT * FROM ${this.#NAME_TABLE} WHERE active = true`
      );
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }
      data.rows = data.rows.map((item) => ({
        ...item,
        image: `${URL_HOST}/uploads/global_category/${item.image}`
      }));
      res.json(data.rows);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  getOne = async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }
      const data = await db_default.query(
        `SELECT * FROM ${this.#NAME_TABLE} WHERE id = $1`,
        [id]
      );
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json({
        data: data.rows[0],
        meta: {}
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  };
  getOneName = async (req, res) => {
    try {
      const name = req.params.name;
      if (!name) {
        return res.status(400).json({ error: "name is required" });
      }
      const data = await db_default.query(
        `SELECT * FROM ${this.#NAME_TABLE} WHERE name_en = $1`,
        [name]
      );
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }
      data.rows = data.rows.map((item) => ({
        ...item,
        image: `${URL_HOST}/uploads/global_category/${item.image}`
      }));
      res.json({
        data: data.rows[0],
        meta: {}
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
    const updateQuery = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(", ");
    const values = Object.values(updates);
    values.push(id);
    const query = `UPDATE ${this.#NAME_TABLE} SET ${updateQuery} WHERE id = $${values.length}`;
    try {
      const data = await db_default.query(query, values);
      res.status(200).send({ message: "Item updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Failed to update item" });
    }
  };
  delete = async (req, res) => {
    const id = req.params.id;
    const data = await db_default.query(
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
      await db_default.query(
        `UPDATE ${this.#NAME_TABLE} SET active = $1 WHERE id = $2`,
        [activity, id]
      );
      res.json("success");
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  };
};
var global_category_controller_default = new GlobalCategoryController();

// routes/global-category.routes.mjs
var router2 = import_express2.default.Router();
var storage2 = import_multer2.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path3.extname(file.originalname));
  }
});
var upload2 = (0, import_multer2.default)({ storage: storage2 });
router2.post(
  "/global-category",
  upload2.single("image"),
  (0, import_celebrate2.celebrate)({
    [import_celebrate2.Segments.BODY]: import_celebrate2.Joi.object().keys({
      name: import_celebrate2.Joi.string().required()
    })
  }),
  global_category_controller_default.create
);
router2.post(
  "/global-category/url-image",
  global_category_controller_default.createUrlImage
);
router2.get("/global-category", global_category_controller_default.get);
router2.get("/global-category/:id", global_category_controller_default.getOne);
router2.get(
  "/global-category/name_en/:name",
  global_category_controller_default.getOneName
);
router2.patch(
  "/global-category/:id",
  upload2.single("image"),
  global_category_controller_default.update
);
router2.delete("/global-category/:id", global_category_controller_default.delete);
router2.patch(
  "/global-category/activity/:id",
  global_category_controller_default.activity
);
var global_category_routes_default = router2;

// routes/company.routes.mjs
var import_express3 = __toESM(require("express"), 1);
var import_celebrate3 = require("celebrate");
var import_multer3 = __toESM(require("multer"), 1);
var path5 = __toESM(require("path"), 1);

// controllers/company.controller.mjs
var import_sharp2 = __toESM(require("sharp"), 1);
var path4 = __toESM(require("path"), 1);
var __rootPath2 = process.cwd();
var CompanyController = class {
  #NAME_TABLE = "companies";
  create = async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    try {
      const { name, categories, global_categories, description } = req.body;
      const { path: tempPath, originalname, filename } = req.file;
      const targetPath = path4.join(__rootPath2, `uploads/companies/${filename}`);
      await (0, import_sharp2.default)(tempPath).toFile(targetPath);
      await deleteFile(tempPath);
      const latinText = transliterate(name.trim());
      const newData = await db_default.query(
        `INSERT INTO ${this.#NAME_TABLE} (name, created_at, image, name_en, categories, global_categories, description) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          name.trim(),
          formatDate(/* @__PURE__ */ new Date()),
          filename,
          latinText,
          categories,
          global_categories,
          description
        ]
      );
      res.json(newData.rows[0]);
    } catch (err) {
      res.json({
        error: {
          message: err.message
        }
      });
      console.error(err);
    }
  };
  createUrlImage = async (req, res) => {
    try {
      const { name, image_url, categories, global_categories, description } = req.body;
      const dataImage = {};
      const filename = await downloadFileHttps(image_url);
      await downloadFileV2(dataImage, filename, "companies");
      const latinText = transliterate(name.trim());
      const newData = await db_default.query(
        `INSERT INTO ${this.#NAME_TABLE} (name, created_at, image, name_en, categories, global_categories, description) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          name.trim(),
          formatDate(/* @__PURE__ */ new Date()),
          filename,
          latinText,
          categories,
          global_categories,
          description
        ]
      );
      res.json(newData.rows[0]);
    } catch (err) {
      res.json({
        error: {
          message: err.message
        }
      });
      console.error(err);
    }
  };
  get = async (req, res) => {
    try {
      const data = await db_default.query(`SELECT * FROM ${this.#NAME_TABLE}`);
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }
      data.rows = data.rows.map((item) => ({
        ...item,
        image: `${URL_HOST}/uploads/companies/${item.image}`
      }));
      res.json(data.rows);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  getOneName = async (req, res) => {
    try {
      const name = req.params.name;
      if (!name) {
        return res.status(400).json({ error: "name is required" });
      }
      const data = await db_default.query(
        `SELECT * FROM ${this.#NAME_TABLE} WHERE name_en = $1`,
        [name]
      );
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }
      data.rows = data.rows.map((item) => ({
        ...item,
        image: `${URL_HOST}/uploads/companies/${item.image}`
      }));
      const getGlobalCategories = async (categories) => {
        for (let i = 0; i < categories.length; i++) {
          const globalCategories = await db_default.query(
            `SELECT * FROM global_category WHERE id = $1`,
            [categories[i].global_category_id]
          );
          categories[i].global_category = globalCategories.rows[0];
        }
      };
      if (Array.isArray(data.rows[0].categories) && data.rows[0].categories.length > 0) {
        const categories = await db_default.query(
          `SELECT * FROM category WHERE id = ANY($1::int[])`,
          [data.rows[0].categories]
        );
        await getGlobalCategories(categories.rows);
        data.rows[0].categories = categories.rows.map((item) => ({
          ...item,
          image: `${URL_HOST}/uploads/category/${item.image}`
        }));
      }
      res.json(data.rows[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  };
  getCategoryId = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await db_default.query(
        `SELECT * FROM ${this.#NAME_TABLE} where $1 = ANY(categories)`,
        [id]
      );
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }
      data.rows = data.rows.map((item) => ({
        ...item,
        image: `${URL_HOST}/uploads/companies/${item.image}`
      }));
      res.json(data.rows);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  getGlobalCategoryId = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await db_default.query(
        `SELECT * FROM ${this.#NAME_TABLE} where $1 = ANY(global_categories)`,
        [id]
      );
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }
      data.rows = data.rows.map((item) => ({
        ...item,
        image: `${URL_HOST}/uploads/companies/${item.image}`
      }));
      res.json(data.rows);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  getOne = async (req, res) => {
    const id = req.params.id;
    const category = await db_default.query(
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
    const updateQuery = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(", ");
    const values = Object.values(updates);
    values.push(id);
    const query = `UPDATE ${this.#NAME_TABLE} SET ${updateQuery} WHERE id = $${values.length}`;
    try {
      const data = await db_default.query(query, values);
      res.status(200).send({ message: "Item updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Failed to update item" });
    }
  };
  delete = async (req, res) => {
    const id = req.params.id;
    const category = await db_default.query(
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
      await db_default.query(
        `UPDATE ${this.#NAME_TABLE} SET active = $1 WHERE id = $2`,
        [activity, id]
      );
      res.json("success");
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  };
};
var company_controller_default = new CompanyController();

// routes/company.routes.mjs
var router3 = import_express3.default.Router();
var storage3 = import_multer3.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path5.extname(file.originalname));
  }
});
var upload3 = (0, import_multer3.default)({ storage: storage3 });
router3.post("/company", upload3.single("image"), company_controller_default.create);
router3.post("/company/url-image", company_controller_default.createUrlImage);
router3.get("/company", company_controller_default.get);
router3.get("/company/category/:id", company_controller_default.getCategoryId);
router3.get(
  "/company/global-category/:id",
  company_controller_default.getGlobalCategoryId
);
router3.get("/company/name_en/:name", company_controller_default.getOneName);
router3.get("/company/:id", company_controller_default.getOne);
router3.put(
  "/company",
  (0, import_celebrate3.celebrate)({
    [import_celebrate3.Segments.BODY]: import_celebrate3.Joi.object().keys({
      id: import_celebrate3.Joi.number().required(),
      name: import_celebrate3.Joi.string().required(),
      code: import_celebrate3.Joi.number().required()
    })
  }),
  company_controller_default.update
);
router3.delete("/company/:id", company_controller_default.delete);
router3.patch(
  "/company/:id",
  upload3.single("image"),
  company_controller_default.update
);
router3.patch("/company/activity/:id", company_controller_default.activity);
var company_routes_default = router3;

// routes/product.routes.mjs
var import_express4 = __toESM(require("express"), 1);
var import_celebrate4 = require("celebrate");
var import_multer4 = __toESM(require("multer"), 1);
var path6 = __toESM(require("path"), 1);

// controllers/product.controller.mjs
var ProductController = class {
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
      const newData = await db_default.query(
        `INSERT INTO ${this.#NAME_TABLE} (name, created_at, image, name_en, description, category_id, specifications, metadata_desc) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          name.trim(),
          formatDate(/* @__PURE__ */ new Date()),
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
          message: err.message
        }
      });
      console.error(err);
    }
  };
  createUrlImage = async (req, res) => {
    try {
      const { name, categoryId, description, specifications, image_url } = req.body;
      const dataImage = {};
      const filename = await downloadFileHttps(image_url);
      await downloadFileV2(dataImage, filename, "products");
      const latinText = transliterate(name.trim());
      const newData = await db_default.query(
        `INSERT INTO ${this.#NAME_TABLE} (name, created_at, image, name_en, description, category_id, specifications) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          name.trim(),
          formatDate(/* @__PURE__ */ new Date()),
          filename,
          latinText,
          description,
          categoryId,
          !specifications ? null : JSON.stringify(specifications)
        ]
      );
      res.json(newData.rows[0]);
    } catch (err) {
      res.json({
        error: {
          message: err.message
        }
      });
      console.error(err);
    }
  };
  get = async (req, res) => {
    try {
      const data = await db_default.query(`SELECT * FROM ${this.#NAME_TABLE}`);
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }
      data.rows = data.rows.map((item) => ({
        ...item,
        image: `${URL_HOST}/uploads/products/${item.image}`
      }));
      res.json(data.rows);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  getOneName = async (req, res) => {
    try {
      const name = req.params.name;
      if (!name) {
        return res.status(400).json({ error: "name is required" });
      }
      const data = await db_default.query(
        `SELECT * FROM ${this.#NAME_TABLE} WHERE name_en = $1`,
        [name]
      );
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }
      data.rows = data.rows.map((item) => ({
        ...item,
        image: `${URL_HOST}/uploads/products/${item.image}`
      }));
      res.json(data.rows[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  };
  getCompanyId = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await db_default.query(
        `SELECT * FROM ${this.#NAME_TABLE} where companies_id = $1`,
        [id]
      );
      const dataCompany = await db_default.query(
        "SELECT * FROM companies where id = $1",
        [id]
      );
      if (dataCompany.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }
      data.rows = data.rows.map((item) => ({
        ...item,
        image: `${URL_HOST}/uploads/products/${item.image}`
      }));
      res.json({
        company: {
          name: dataCompany.rows[0].name,
          name_en: dataCompany.rows[0].name_en
        },
        data: data.rows
      });
    } catch (error) {
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
      const dataCategory = await db_default.query(
        `SELECT * FROM category WHERE name_en = $1`,
        [nameCategory]
      );
      if (dataCategory.rows.length === 0) {
        category = null;
      } else if (dataCategory.rows.length > 0) {
        category = {
          ...dataCategory.rows[0],
          image: `${URL_HOST}/uploads/category/${dataCategory.rows[0].image}`
        };
      }
      const dataProducts = await db_default.query(
        `SELECT * FROM ${this.#NAME_TABLE} where category_id = $1`,
        [dataCategory.rows[0].id]
      );
      if (dataProducts.rows.length === 0) {
        products = [];
      } else if (dataProducts.rows.length > 0) {
        products = dataProducts.rows.map((item) => ({
          ...item,
          image: `${URL_HOST}/uploads/products/${item.image}`
        }));
      } else {
        products = null;
      }
      const dataGlobalCategory = await db_default.query(
        "SELECT * FROM global_category where id = $1",
        [dataCategory.rows[0].global_category_id]
      );
      if (dataGlobalCategory.rows.length === 0) {
        global_cat = null;
      } else if (dataGlobalCategory.rows.length > 0) {
        global_cat = {
          name: dataGlobalCategory.rows[0].name,
          name_en: dataGlobalCategory.rows[0].name_en
        };
      }
      res.json({
        global_cat,
        products,
        category
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  getOne = async (req, res) => {
    const id = req.params.id;
    const category = await db_default.query(
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
    await downloadFile(req, updates, "products");
    const updateQuery = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(", ");
    const values = Object.values(updates);
    values.push(id);
    const query = `UPDATE ${this.#NAME_TABLE} SET ${updateQuery} WHERE id = $${values.length}`;
    try {
      const data = await db_default.query(query, values);
      res.status(200).send({ message: "Item updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Failed to update item" });
    }
  };
  delete = async (req, res) => {
    const id = req.params.id;
    const category = await db_default.query(
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
      await db_default.query(
        `UPDATE ${this.#NAME_TABLE} SET active = $1 WHERE id = $2`,
        [activity, id]
      );
      res.json("success");
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  };
};
var product_controller_default = new ProductController();

// routes/product.routes.mjs
var router4 = import_express4.default.Router();
var storage4 = import_multer4.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path6.extname(file.originalname));
  }
});
var upload4 = (0, import_multer4.default)({ storage: storage4 });
router4.post("/product", upload4.single("image"), product_controller_default.create);
router4.post("/product/url-image", product_controller_default.createUrlImage);
router4.get("/product", product_controller_default.get);
router4.get("/product-list/:nameCategory", product_controller_default.getList);
router4.get("/product/company/:id", product_controller_default.getCompanyId);
router4.get("/product/:id", product_controller_default.getOne);
router4.get("/product/name_en/:name", product_controller_default.getOneName);
router4.patch("/product/:id", upload4.single("image"), product_controller_default.update);
router4.delete("/product/:id", product_controller_default.delete);
router4.delete("/product/activity/:id", product_controller_default.activity);
var product_routes_default = router4;

// routes/send-request.routes.mjs
var import_express5 = __toESM(require("express"), 1);

// controllers/send-request.controller.mjs
var import_nodemailer = __toESM(require("nodemailer"), 1);
var import_dotenv2 = require("dotenv");
(0, import_dotenv2.config)();
var SendRequestController = class {
  async send(req, res) {
    const { NODEMAILER_USER, NODEMAILER_PASS, LIST_EMAIL } = process.env;
    const {
      manufactured,
      inn,
      name_org,
      contact_person,
      email,
      phone,
      additional_info
    } = req.body;
    try {
      let transporter = import_nodemailer.default.createTransport({
        host: "connect.smtp.bz",
        port: 2525,
        secure: false,
        auth: {
          user: NODEMAILER_USER,
          pass: NODEMAILER_PASS
        }
      });
      await transporter.sendMail({
        from: `"ENGINEERING INTELLIGENCE TEAM" <noreply@idlepshokoff.com>`,
        to: LIST_EMAIL,
        subject: "\u0417\u0430\u043A\u0430\u0437",
        text: `${req.body}`,
        html: `
        <ul>
          <li>\u041F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u044F: ${manufactured}</li>
          <li>\u0418\u041D\u041D: ${inn}</li>
          <li>\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438: ${name_org}</li>
          <li>\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u043E\u0435 \u043B\u0438\u0446\u043E: ${contact_person}</li>
          <li>Email: ${email}</li>
          <li>\u0422\u0435\u043B\u0435\u0444\u043E\u043D: ${phone}</li>
          <li>\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E\u0431 \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u0438 (\u0431\u0440\u0435\u043D\u0434, \u0430\u0440\u0442\u0438\u043A\u0443\u043B \u0438\u043B\u0438 \u0441\u0435\u0440\u0438\u0439\u043D\u044B\u0439 \u043D\u043E\u043C\u0435\u0440, \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E): ${additional_info}</li>
        </ul>`
      });
      res.status(200).json("successful");
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: err.message
      });
    }
  }
};
var send_request_controller_default = new SendRequestController();

// routes/send-request.routes.mjs
var router5 = import_express5.default.Router();
router5.post("/send-request", send_request_controller_default.send);
var send_request_routes_default = router5;

// routes/image.routes.mjs
var import_express6 = __toESM(require("express"), 1);
var import_multer5 = __toESM(require("multer"), 1);
var path7 = __toESM(require("path"), 1);

// controllers/image.controller.mjs
var ImageController = class {
  #NAME_TABLE = "images";
  create = async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    try {
      const dataImage = {};
      await downloadFile(req, dataImage, "images");
      const newData = await db_default.query(
        `INSERT INTO ${this.#NAME_TABLE} (name, created_at) values ($1, $2) RETURNING *`,
        [dataImage.image, formatDate(/* @__PURE__ */ new Date())]
      );
      res.json({
        data: {
          image: `${URL_HOST}/uploads/images/${dataImage.image}`
        }
      });
    } catch (err) {
      res.json({
        error: {
          message: err.message
        }
      });
      console.error(err);
    }
  };
  get = async (req, res) => {
    try {
      const data = await db_default.query(`SELECT * FROM ${this.#NAME_TABLE}`);
      if (data.rows.length === 0) {
        return res.status(404).json({ error: "No categories found" });
      }
      data.rows = data.rows.map((item) => ({
        ...item,
        name: `${URL_HOST}/uploads/images/${item.name}`
      }));
      res.json(data.rows);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};
var image_controller_default = new ImageController();

// routes/image.routes.mjs
var router6 = import_express6.default.Router();
var storage5 = import_multer5.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path7.extname(file.originalname));
  }
});
var upload5 = (0, import_multer5.default)({ storage: storage5 });
router6.post("/image", upload5.single("image"), image_controller_default.create);
router6.get("/image", image_controller_default.get);
var image_routes_default = router6;

// routes/auth.routes.mjs
var import_express7 = __toESM(require("express"), 1);
var import_celebrate5 = require("celebrate");

// controllers/auth.controller.mjs
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_dotenv3 = require("dotenv");
(0, import_dotenv3.config)();
var { JWT_SECRET } = process.env;
var AuthController = class {
  login = async (req, res) => {
    const { login, password } = req.body;
    try {
      const result = await db_default.query("SELECT * FROM admins WHERE login = $1", [login]);
      if (result.rows.length === 0) {
        return res.status(401).json({ message: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043B\u043E\u0433\u0438\u043D \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C" });
      }
      const user = result.rows[0];
      const isMatch = await import_bcryptjs.default.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043B\u043E\u0433\u0438\u043D \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C" });
      }
      const token = import_jsonwebtoken.default.sign(
        { id: user.id, login: user.login },
        JWT_SECRET,
        { expiresIn: "180d" }
      );
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430" });
    }
  };
  register = async (req, res) => {
    const { login, password } = req.body;
    try {
      const existing = await db_default.query("SELECT id FROM admins WHERE login = $1", [login]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ message: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442" });
      }
      const hash = await import_bcryptjs.default.hash(password, 10);
      const result = await db_default.query(
        "INSERT INTO admins (login, password_hash) VALUES ($1, $2) RETURNING id, login, created_at",
        [login, hash]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430" });
    }
  };
};
var auth_controller_default = new AuthController();

// routes/auth.routes.mjs
var router7 = import_express7.default.Router();
router7.post(
  "/auth/login",
  (0, import_celebrate5.celebrate)({
    [import_celebrate5.Segments.BODY]: import_celebrate5.Joi.object().keys({
      login: import_celebrate5.Joi.string().required(),
      password: import_celebrate5.Joi.string().required()
    })
  }),
  auth_controller_default.login
);
router7.post(
  "/auth/register",
  (0, import_celebrate5.celebrate)({
    [import_celebrate5.Segments.BODY]: import_celebrate5.Joi.object().keys({
      login: import_celebrate5.Joi.string().min(3).required(),
      password: import_celebrate5.Joi.string().min(6).required()
    })
  }),
  auth_controller_default.register
);
var auth_routes_default = router7;

// src/app.mjs
(0, import_dotenv4.config)();
var { NODE_ENV, JWT_SECRET: JWT_SECRET2 } = process.env;
var PORT = NODE_ENV === "production" ? process.env?.PORT ?? 3030 : 3030;
var URL_HOST = process.env?.URL_HOST;
var app = (0, import_express8.default)();
app.use(import_body_parser.default.json());
app.use(import_body_parser.default.urlencoded({ extended: true }));
app.use((0, import_cookie_parser.default)(NODE_ENV === "production" ? JWT_SECRET2 : "dev-secret"));
app.use(requestLogger);
app.use(cors_default);
app.use("/api/v1/", auth_routes_default);
app.use("/api/v1/", category_routes_default);
app.use("/api/v1/", global_category_routes_default);
app.use("/api/v1/", company_routes_default);
app.use("/api/v1/", product_routes_default);
app.use("/api/v1/", send_request_routes_default);
app.use("/api/v1/", image_routes_default);
app.get("/", (req, res) => {
  res.send("<h1>HOOOOME</h1>");
});
app.use((req, res, next) => {
  next(new not_found_error_default("404 \u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043F\u043E \u0443\u043A\u0430\u0437\u0430\u043D\u043D\u043E\u043C\u0443 \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u0443 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430."));
});
app.use(errorLogger);
app.use((0, import_celebrate6.errors)());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.log(message);
  console.log(statusCode);
  res.status(statusCode).send({
    message: statusCode === 500 ? "500 \u041D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435 \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430." : message
  });
  next();
});
app.listen(PORT, () => {
  console.log(`App listening ob port ${PORT}`);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  URL_HOST
});

import express from "express";
import { Joi, celebrate, Segments } from "celebrate";
import multer from "multer";
import * as path from "path";
import productController from "../controllers/product.controller.mjs";

const router = express.Router(); // создали роутер
// Настройка multer для хранения загруженных файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Генерируем уникальное имя файла
  },
});

const upload = multer({ storage: storage });

router.post("/product", upload.single("image"), productController.create);
router.get("/product", productController.get);
router.get("/product/company/:id", productController.getCompanyId);
router.get("/product/:id", productController.getOne);
router.get("/product/name_en/:name", productController.getOneName);
router.patch("/product/:id", productController.update);
router.delete("/product/:id", productController.delete);
router.delete("/product/activity/:id", productController.activity);

export default router;

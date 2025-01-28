import express from "express";
import multer from "multer";
import * as path from "path";
import imageController from "../controllers/image.controller.mjs";

const router = express.Router(); // создали роутер
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Генерируем уникальное имя файла
  },
});

const upload = multer({ storage: storage });

router.post("/image", upload.single("image"), imageController.create);
router.get("/image", imageController.get);

export default router;

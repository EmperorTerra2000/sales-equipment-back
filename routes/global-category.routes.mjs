import express from "express";
import { Joi, celebrate, Segments } from "celebrate";
import multer from "multer";
import * as path from "path";
import globalCategoryController from "../controllers/global-category.controller.mjs";

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

//const upload = multer({ dest: "uploads/" }); // Указываем папку для временного хранения файлов

// Middleware для обработки multipart/form-data и валидации данных
// const validateUpload = celebrate({
//   [Segments.BODY]: Joi.object().keys({
//     // Добавьте здесь ваши валидации для текстовых полей формы
//     email: Joi.string().required(),
//     password: Joi.string().required(),
//   }),
// });

// router.post("/signin", upload.single("file"), validateUpload, login);

router.post(
  "/global-category",
  upload.single("image"),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
    }),
  }),
  globalCategoryController.create
);
router.get("/global-category", globalCategoryController.get);
router.get("/global-category/:id", globalCategoryController.getOne);
router.get(
  "/global-category/name_en/:name",
  globalCategoryController.getOneName
);
router.patch("/global-category/:id", globalCategoryController.update);
router.delete("/global-category/:id", globalCategoryController.delete);

export default router;

import express from "express";
import { Joi, celebrate, Segments } from "celebrate";
//import multer from "multer";
import categoryController from "../controllers/category.controller.mjs";

const router = express.Router(); // создали роутер

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

router.post("/category", categoryController.createCategory);
router.get("/category", categoryController.getCategory);
router.get("/category:id", categoryController.getOneCategory);
router.put(
  "/category",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  categoryController.updateCategory
);
router.delete(
  "/category:id",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  categoryController.deleteCategory
);

export default router;

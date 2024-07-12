import express from "express";
import { Joi, celebrate, Segments } from "celebrate";
import multer from "multer";
import globalCategoryController from "../controllers/global-category.controller.mjs";

const router = express.Router(); // создали роутер
const upload = multer({
  dest: "uploads/",
});

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
router.put(
  "/global-category",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.number().required(),
      name: Joi.string().required(),
      code: Joi.number().required(),
    }),
  }),
  globalCategoryController.update
);
router.delete("/global-category/:id", globalCategoryController.delete);

export default router;

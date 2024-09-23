import express from "express";
import { Joi, celebrate, Segments } from "celebrate";
import multer from "multer";
import * as path from "path";
import categoryController from "../controllers/category.controller.mjs";

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

router.post("/category", upload.single("image"), categoryController.create);
router.get("/category", categoryController.get);
router.get("/category/:id", categoryController.getOne);
router.get("/category/name_en/:name", categoryController.getOneName);
router.get("/category/global-id/:id", categoryController.getGlobalId);
router.put(
  "/category",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.number().required(),
      name: Joi.string().required(),
      code: Joi.number().required(),
    }),
  }),
  categoryController.update
);
router.delete("/category/:id", categoryController.delete);
router.patch("/category/:id", categoryController.update);
router.patch("/category/activity/:id", categoryController.activity);

export default router;

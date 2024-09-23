import express from "express";
import { Joi, celebrate, Segments } from "celebrate";
import multer from "multer";
import * as path from "path";
import companyController from "../controllers/company.controller.mjs";

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

router.post("/company", upload.single("image"), companyController.create);
router.get("/company", companyController.get);
router.get("/company/category/:id", companyController.getCategoryId);
router.get("/company/name_en/:name", companyController.getOneName);
router.get("/company/:id", companyController.getOne);
router.put(
  "/company",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.number().required(),
      name: Joi.string().required(),
      code: Joi.number().required(),
    }),
  }),
  companyController.update
);
router.delete("/company/:id", companyController.delete);
router.patch("/company/activity/:id", companyController.activity);

export default router;

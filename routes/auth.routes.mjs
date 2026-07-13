import express from "express";
import { Joi, celebrate, Segments } from "celebrate";
import authController from "../controllers/auth.controller.mjs";

const router = express.Router();

router.post(
  "/auth/login",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      login: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  authController.login
);

router.post(
  "/auth/register",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      login: Joi.string().min(3).required(),
      password: Joi.string().min(6).required(),
    }),
  }),
  authController.register
);

export default router;

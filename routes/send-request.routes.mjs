import express from "express";
import sendRequestController from "../controllers/send-request.controller.mjs";

const router = express.Router();

router.post("/send-request", sendRequestController.send);

export default router;

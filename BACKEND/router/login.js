import express from "express";
import { loginGeneral } from "../controllers/login.js";

const router = express.Router();

router.post("/", loginGeneral);

export default router;

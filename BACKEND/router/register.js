import express from "express";
import { registerUsuarioApp } from "../controllers/register.js";

const router = express.Router();

router.post("/register", registerUsuarioApp);

export default router;

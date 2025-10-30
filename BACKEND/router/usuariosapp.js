import express from "express";
import {
  getUsuariosApp,
  createUsuarioApp,
  loginUsuarioApp,
} from "../controllers/usuariosapp.js";

const router = express.Router();

router.get("/", getUsuariosApp);
router.post("/", createUsuarioApp);
router.post("/login", loginUsuarioApp);

export default router;

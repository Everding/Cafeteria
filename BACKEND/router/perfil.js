import express from "express";
import {
  getPerfil,
  actualizarImagenPerfil,
  cambiarPassword,
  upload,
    actualizarPerfil,
} from "../controllers/perfil.js";
import { verificarToken } from "../middlewares/auth.js";

const router = express.Router();

// 🧍 Obtener perfil (usuario o personal)
router.get("/", verificarToken, getPerfil);

router.put("/", verificarToken, actualizarPerfil); // 🔹 Nueva ruta

// 🖼️ Cambiar foto de perfil
router.put("/imagen", verificarToken, upload.single("imagen"), actualizarImagenPerfil);

// 🔒 Cambiar contraseña
router.put("/password", verificarToken, cambiarPassword);

export default router;

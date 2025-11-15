import express from "express";
import { loginGeneral } from "../controllers/login.js"; // tu controlador actualizado
import { verificarToken } from "../middlewares/auth.js";

const router = express.Router();

// Ruta pública (no requiere token)
router.post("/Login", loginGeneral);

// Ruta protegida (requiere token válido)
router.get("/MiPerfil", verificarToken, (req, res) => {
  res.json({
    success: true,
    message: "Acceso concedido",
    user: req.user,
  });
});

export default router;

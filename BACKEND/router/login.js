import express from "express";
import { loginGeneral, contrasenaOlvidada, restablecerContrasena } from "../controllers/login.js";

const router = express.Router();

router.post("/", loginGeneral);
router.post("/contrasena-olvidada", contrasenaOlvidada)
router.post("/restablecer", restablecerContrasena);

export default router;

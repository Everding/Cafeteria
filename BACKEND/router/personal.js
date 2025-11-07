import express from "express";
import { verificarToken, soloPersonal } from "../middlewares/auth.js";
import {
  getPersonal,
  createPersonal,
  updatePersonal,
  deletePersonal,
  upload,
} from "../controllers/personal.js";

const router = express.Router();

// GET todos
router.get("/", getPersonal, verificarToken, soloPersonal);

// POST nuevo
router.post("/", upload.single("imagen"), createPersonal, verificarToken, soloPersonal);

// PUT actualizar por ID
router.put("/:idPersonal", upload.single("imagen"), updatePersonal, verificarToken, soloPersonal);


// DELETE eliminar por ID
router.delete("/:id", deletePersonal, verificarToken, soloPersonal);

export default router;

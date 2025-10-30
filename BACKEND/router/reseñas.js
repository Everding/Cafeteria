import express from "express";
import {
  getAllResenas,
  getResenaById,
  createResena,
  updateResena,
  deleteResena
} from "../controllers/reseñas.js";

const router = express.Router();

// Obtener todas las reseñas
router.get("/", getAllResenas);

// Obtener reseña por ID
router.get("/:idResena", getResenaById);

// Crear nueva reseña
router.post("/", createResena);

// Actualizar reseña
router.put("/:idResena", updateResena);

// Eliminar reseña
router.delete("/:idResena", deleteResena);

export default router;

import express from "express";
import {
  getAllMateriasPrimas,
  getMateriaPrimaById,
  createMateriaPrima,
  updateMateriaPrima,
  deleteMateriaPrima
} from "../controllers/materiaprima.js";

const router = express.Router();

// Obtener todas las materias primas
router.get("/", getAllMateriasPrimas);

// Obtener materia prima por ID
router.get("/:id_materia", getMateriaPrimaById);

// Crear nueva materia prima
router.post("/", createMateriaPrima);

// Actualizar materia prima
router.put("/:id_materia", updateMateriaPrima);

// Eliminar materia prima
router.delete("/:id_materia", deleteMateriaPrima);

export default router;

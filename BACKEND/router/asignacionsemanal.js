import express from "express";
import {
  getAllAsignaciones,
  getAsignacionById,
  createAsignacion,
  updateAsignacion,
  deleteAsignacion
} from "../controllers/asignacionsemanal.js";

const router = express.Router();

// Obtener todas las asignaciones
router.get("/", getAllAsignaciones);

// Obtener asignación por ID
router.get("/:idAsignacion", getAsignacionById);

// Crear nueva asignación semanal
router.post("/", createAsignacion);

// Actualizar asignación semanal
router.put("/:idAsignacion", updateAsignacion);

// Eliminar asignación semanal
router.delete("/:idAsignacion", deleteAsignacion);

export default router;

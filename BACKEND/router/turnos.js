import express from "express";
import {
  getAllTurnos,
  getTurnoById,
  createTurno,
  updateTurno,
  deleteTurno
} from "../controllers/turnos.js";

const router = express.Router();

// Obtener todos los turnos
router.get("/", getAllTurnos);

// Obtener turno por ID
router.get("/:idTurno", getTurnoById);

// Crear nuevo turno
router.post("/", createTurno);

// Actualizar turno
router.put("/:idTurno", updateTurno);

// Eliminar turno
router.delete("/:idTurno", deleteTurno);

export default router;

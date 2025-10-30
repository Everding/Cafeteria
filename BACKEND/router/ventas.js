import express from "express";
import {
  getAllVentas,
  getVentaById,
  createVenta,
  updateVenta,
  deleteVenta
} from "../controllers/ventas.js";

const router = express.Router();

// Obtener todas las ventas
router.get("/", getAllVentas);

// Obtener venta por ID
router.get("/:idVenta", getVentaById);

// Crear nueva venta
router.post("/", createVenta);

// Actualizar venta
router.put("/:idVenta", updateVenta);

// Eliminar venta
router.delete("/:idVenta", deleteVenta);

export default router;

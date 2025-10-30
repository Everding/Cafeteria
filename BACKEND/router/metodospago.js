import express from "express";
import {
  getAllMetodosPago,
  getMetodoPagoById,
  createMetodoPago,
  updateMetodoPago,
  deleteMetodoPago
} from "../controllers/metodospago.js";

const router = express.Router();

// Obtener todos los métodos de pago
router.get("/", getAllMetodosPago);

// Obtener método de pago por ID
router.get("/:id_metodo_pago", getMetodoPagoById);

// Crear nuevo método de pago
router.post("/", createMetodoPago);

// Actualizar método de pago
router.put("/:id_metodo_pago", updateMetodoPago);

// Eliminar método de pago
router.delete("/:id_metodo_pago", deleteMetodoPago);

export default router;

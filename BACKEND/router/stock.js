import express from "express";
import {
  getAllStock,
  getStockById,
  createStock,
  updateStock,
  deleteStock
} from "../controllers/stock.js";

const router = express.Router();

// Obtener todo el stock
router.get("/", getAllStock);

// Obtener stock por ID
router.get("/:id_stock", getStockById);

// Crear nuevo registro de stock
router.post("/", createStock);

// Actualizar registro de stock
router.put("/:id_stock", updateStock);

// Eliminar registro de stock
router.delete("/:id_stock", deleteStock);

export default router;

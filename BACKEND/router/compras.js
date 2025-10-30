import express from "express";
import {
  getAllCompras,
  getCompraById,
  createCompra,
  updateCompra,
  deleteCompra
} from "../controllers/compras.js";

const router = express.Router();

// ==============================
// Rutas de /api/compras
// ==============================

// Obtener todas las compras (historial)
router.get("/", getAllCompras);

// Obtener una compra por ID
router.get("/:id", getCompraById);

// Registrar una nueva compra
router.post("/", createCompra);

// Actualizar una compra existente
router.put("/:id", updateCompra);

// Eliminar una compra
router.delete("/:id", deleteCompra);

export default router;

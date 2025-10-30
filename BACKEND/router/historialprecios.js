import express from "express";
import {
  getAllHistorialPrecios,
  addHistorialPrecio,
  getHistorialByProducto
} from "../controllers/historialprecios.js";

const router = express.Router();

// Obtener todos los cambios de precio
router.get("/", getAllHistorialPrecios);

// Agregar un nuevo registro de historial de precio
router.post("/", addHistorialPrecio);

// Obtener historial de un producto específico
router.get("/:id_producto", getHistorialByProducto);

export default router;

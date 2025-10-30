import express from "express";
import {
  getDetalleCarritoByCarrito,
  addDetalleCarrito,
  updateDetalleCarrito,
  deleteDetalleCarrito
} from "../controllers/detallecarrito.js";

const router = express.Router();

// Obtener todos los detalles de un carrito
router.get("/:id_carrito", getDetalleCarritoByCarrito);

// Agregar un producto o menú al carrito
router.post("/", addDetalleCarrito);

// Actualizar un detalle del carrito
router.put("/:id_detalle", updateDetalleCarrito);

// Eliminar un detalle del carrito
router.delete("/:id_detalle", deleteDetalleCarrito);

export default router;

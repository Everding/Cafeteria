import express from "express";
import { verificarToken } from "../middlewares/auth.js";
import {
  getDetalleCarritoByCarrito,
  addDetalleCarrito,
  updateDetalleCarrito,
  deleteDetallesByCarrito,
  deleteDetalleCarrito, 
  getCantidadCarrito
} from "../controllers/detallecarrito.js";

const router = express.Router();

// Todas las rutas que requieren autenticación
router.use(verificarToken);

// Obtener todos los detalles de un carrito
router.get("/:id_carrito", getDetalleCarritoByCarrito);

// Agregar un producto o menú al carrito
router.post("/", addDetalleCarrito);

// Actualizar un detalle del carrito
router.put("/:id_detalle", updateDetalleCarrito);

// Eliminar un detalle del carrito
router.delete("/:id_detalle", deleteDetalleCarrito);

// Eliminar todos los detalles de un carrito
router.delete("/carrito/:id_carrito", deleteDetallesByCarrito);

// Obtener cantidad total de productos en el carrito
router.get("/count/:id_carrito", getCantidadCarrito);

export default router;

import express from "express";
import {
  getAllCarritos,
  getCarritoById,
  createCarrito,
  updateCarrito,
  deleteCarrito
} from "../controllers/carrito.js";

const router = express.Router();

// Obtener todos los carritos activos
router.get("/", getAllCarritos);

// Obtener carrito con detalle de productos
router.get("/:id_carrito", getCarritoById);

// Crear nuevo carrito
router.post("/", createCarrito);

// Actualizar carrito
router.put("/:id_carrito", updateCarrito);

// Eliminar carrito
router.delete("/:id_carrito", deleteCarrito);

export default router;

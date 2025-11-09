import express from "express";
import { verificarToken } from "../middlewares/auth.js";
import {
  getAllCarritos,
  getCarritoById,
  createCarrito,
  updateCarrito,
  deleteCarrito,
  getOrCreateCarritoActivo,
  getCantidadCarritoActivo
} from "../controllers/carrito.js";

const router = express.Router();

// ✅ Ruta protegida para obtener o crear carrito activo
router.get("/activo", verificarToken, getOrCreateCarritoActivo);

// Obtener todos los carritos
router.get("/", getAllCarritos);

// Obtener carrito por ID
router.get("/:id_carrito", getCarritoById);

// Crear carrito manual
router.post("/", createCarrito);

// Actualizar carrito
router.put("/:id_carrito", updateCarrito);

// Eliminar carrito
router.delete("/:id_carrito", deleteCarrito);

// ✅ Ruta protegida para obtener cantidad de productos en carrito activo
router.get("/cantidad", verificarToken, getCantidadCarritoActivo);

export default router;

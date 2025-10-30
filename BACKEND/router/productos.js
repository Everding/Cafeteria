import express from "express";
import {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
} from "../controllers/productos.js";

const router = express.Router();

// Obtener todos los productos
router.get("/", getAllProductos);

// Obtener producto por ID
router.get("/:id_producto", getProductoById);

// Crear nuevo producto
router.post("/", createProducto);

// Actualizar producto
router.put("/:id_producto", updateProducto);

// Eliminar producto
router.delete("/:id_producto", deleteProducto);

export default router;

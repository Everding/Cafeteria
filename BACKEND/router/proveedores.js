import express from "express";
import {
  getAllProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor
} from "../controllers/proveedores.js";

const router = express.Router();

// Obtener todos los proveedores
router.get("/", getAllProveedores);

// Obtener proveedor por ID
router.get("/:id_proveedor", getProveedorById);

// Crear nuevo proveedor
router.post("/", createProveedor);

// Actualizar proveedor
router.put("/:id_proveedor", updateProveedor);

// Eliminar proveedor
router.delete("/:id_proveedor", deleteProveedor);

export default router;

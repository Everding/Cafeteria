import express from "express";
import {
  getAllSucursales,
  getSucursalById,
  createSucursal,
  updateSucursal,
  deleteSucursal
} from "../controllers/sucursales.js";

const router = express.Router();

// Obtener todas las sucursales
router.get("/", getAllSucursales);

// Obtener sucursal por ID
router.get("/:idSucursal", getSucursalById);

// Crear nueva sucursal
router.post("/", createSucursal);

// Actualizar sucursal
router.put("/:idSucursal", updateSucursal);

// Eliminar sucursal
router.delete("/:idSucursal", deleteSucursal);

export default router;

import express from "express";
import {
  getDetalleMenuByMenu,
  addDetalleMenu,
  updateDetalleMenu,
  deleteDetalleMenu
} from "../controllers/detalleMenu.js";

const router = express.Router();

// Obtener todos los detalles de un menú
router.get("/:id_menu", getDetalleMenuByMenu);

// Agregar un producto al detalle del menú
router.post("/", addDetalleMenu);

// Actualizar un detalle del menú
router.put("/:id_detalle_menu", updateDetalleMenu);

// Eliminar un detalle del menú
router.delete("/:id_detalle_menu", deleteDetalleMenu);

export default router;

import express from "express";
import {
  getAllMenusPrefabricados,
  getMenuPrefabricadoById,
  createMenuPrefabricado,
  updateMenuPrefabricado,
  deleteMenuPrefabricado
} from "../controllers/menusprefabricados.js";

const router = express.Router();

// Obtener todos los menús prefabricados
router.get("/", getAllMenusPrefabricados);

// Obtener menú por ID
router.get("/:id_menu", getMenuPrefabricadoById);

// Crear nuevo menú prefabricado
router.post("/", createMenuPrefabricado);

// Actualizar menú prefabricado
router.put("/:id_menu", updateMenuPrefabricado);

// Eliminar menú prefabricado
router.delete("/:id_menu", deleteMenuPrefabricado);

export default router;

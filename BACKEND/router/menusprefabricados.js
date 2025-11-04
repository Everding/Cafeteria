import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllMenusPrefabricados,
  getMenuPrefabricadoById,
  createMenuPrefabricado,
  updateMenuPrefabricado,
  deleteMenuPrefabricado,
} from "../controllers/menusprefabricados.js";

const router = express.Router();

// Configuración de multer (igual que productos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"), // carpeta uploads/
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

// Rutas
router.get("/", getAllMenusPrefabricados);
router.get("/:id_menu", getMenuPrefabricadoById);
router.post("/", upload.single("imagen"), createMenuPrefabricado);
router.put("/:id_menu", upload.single("imagen"), updateMenuPrefabricado);
router.delete("/:id_menu", deleteMenuPrefabricado);

export default router;

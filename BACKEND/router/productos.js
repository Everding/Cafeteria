import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProductoConImagen,
  deleteProducto,
  cambiarEstadoProducto
} from "../controllers/productos.js";

const router = express.Router();

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"), // carpeta uploads/
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

// Rutas
router.get("/", getAllProductos);
router.get("/:id_producto", getProductoById);
router.post("/", createProducto);
router.put("/:id_producto", upload.single("imagen"), updateProductoConImagen);
router.delete("/:id_producto", deleteProducto);
router.put("/estado/:id_producto", cambiarEstadoProducto);

export default router;

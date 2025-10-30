// routes/categorias.js
import express from "express";
import {
  getCategorias,
  getProductosPorCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categorias.js";

const router = express.Router();

// Rutas accesibles al cliente
router.get("/", getCategorias);
router.get("/:id_categoria/productos", getProductosPorCategoria);

// Rutas restringidas al admin
router.post("/", crearCategoria);
router.put("/:id_categoria", actualizarCategoria);
router.delete("/:id_categoria", eliminarCategoria);

export default router;

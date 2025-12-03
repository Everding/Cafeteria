import { Router } from "express";
import db from "../config/dataBase.js"; // <-- Agregar esto

import {
  getAllMateriasPrimas,
  getMateriaPrimaById,
  createMateriaPrima,
  updateMateriaPrima,
  deleteMateriaPrima,
  cambiarEstado,
  actualizarStockMateria,
  obtenerStockProducto
} from "../controllers/materiaprima.js";

const router = Router();

// Materias primas
router.get("/", getAllMateriasPrimas);
router.get("/:id_materia", getMateriaPrimaById);
router.post("/", createMateriaPrima);
router.put("/:id_materia", updateMateriaPrima);
router.delete("/:id_materia", deleteMateriaPrima);
router.put("/:id_materia/estado", cambiarEstado);
router.put("/:id_materia/stock", actualizarStockMateria);

// Stock de un producto
router.put("/producto/:id_producto/stock", async (req, res) => {
  const { id_producto } = req.params;
  const { materiasPrimas } = req.body;

  if (!Array.isArray(materiasPrimas)) {
    return res.status(400).json({ message: "materiasPrimas debe ser un array" });
  }

  try {
    await db.query("DELETE FROM stock WHERE id_producto = ?", [id_producto]);

    for (const m of materiasPrimas) {
      const { id_materia, cantidad_necesaria } = m;

      if (!id_materia || cantidad_necesaria == null) continue;

      await db.query(
        "INSERT INTO stock (id_producto, id_materia, cantidad_necesaria) VALUES (?, ?, ?)",
        [id_producto, id_materia, cantidad_necesaria]
      );
    }

    res.json({ message: "Stock del producto actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar stock:", err);
    res.status(500).json({ message: "Error al actualizar stock del producto" });
  }
});

router.get("/producto/:id_producto", obtenerStockProducto);

export default router;

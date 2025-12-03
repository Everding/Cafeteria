import express from "express";
import {
  getAllCompras,
  getCompraById,
  createCompra,
  updateCompra,
  deleteCompra
} from "../controllers/compras.js";

const router = express.Router();

router.get("/", getAllCompras);
router.get("/:id", getCompraById);
router.post("/", createCompra);
router.put("/:id", updateCompra);
router.delete("/:id", deleteCompra);

export default router;

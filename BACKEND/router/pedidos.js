import express from "express";
import {
  getAllPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido
} from "../controllers/pedidos.js";

const router = express.Router();

// Obtener todos los pedidos
router.get("/", getAllPedidos);

// Obtener pedido por ID
router.get("/:idPedido", getPedidoById);

// Crear nuevo pedido
router.post("/", createPedido);

// Actualizar pedido
router.put("/:idPedido", updatePedido);

// Eliminar pedido
router.delete("/:idPedido", deletePedido);

export default router;

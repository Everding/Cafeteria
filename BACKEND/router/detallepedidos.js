import express from "express";
import {
  getDetallePedidoByPedido,
  addDetallePedido,
  updateDetallePedido,
  deleteDetallePedido
} from "../controllers/detallepedidos.js";

const router = express.Router();

// Obtener todos los detalles de un pedido
router.get("/:idPedido", getDetallePedidoByPedido);

// Agregar un producto o menú al pedido
router.post("/", addDetallePedido);

// Actualizar un detalle del pedido
router.put("/:idDetalle", updateDetallePedido);

// Eliminar un detalle del pedido
router.delete("/:idDetalle", deleteDetallePedido);

export default router;

import express from "express";
import { generarPreferenciaMP } from "../utils/mercadopago.js";
import { verificarToken, soloUsuariosAppOClientes } from "../middlewares/auth.js";
import { createPedido } from "../controllers/pedidos.js";

const router = express.Router();

router.post("/create_preference", verificarToken, soloUsuariosAppOClientes, async (req, res) => {
  try {
    console.log("BODY RECIBIDO:", req.body);

    const {
      carritoItems = [],
      id_usuario_app,
      id_cliente = null,
      id_sucursal = 1,
      total = 0,
      estado = "Pendiente",
      id_metodo_pago = 1
    } = req.body;

    if (!Array.isArray(carritoItems) || carritoItems.length === 0) {
      return res.status(400).json({ success: false, message: "Carrito vacío" });
    }

    // 1. Crear pedido en ambos casos
    const pedidoCreado = await createPedido({
      carritoItems,
      id_usuario_app,
      id_cliente,
      id_sucursal,
      total,
      estado,
      id_metodo_pago
    });

    // 2. Si es pago con Mercado Pago (id_metodo_pago === 1)
    if (id_metodo_pago === 1) {
      const preference = await generarPreferenciaMP(carritoItems, total);
      return res.json({
        success: true,
        init_point: preference.init_point,
        preferenceId: preference.id,
        pedidoId: pedidoCreado.idPedido || pedidoCreado.id
      });
    }

    // 3. Si es pago simulado (clientes)
    res.json({
      success: true,
      pedidoId: pedidoCreado.idPedido || pedidoCreado.id,
      message: "Pago simulado exitoso"
    });

  } catch (error) {
    console.error("Error en create_preference:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error interno"
    });
  }
});

export default router;
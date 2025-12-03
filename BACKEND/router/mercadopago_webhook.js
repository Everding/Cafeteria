import express from "express";
import db from "../config/dataBase.js";
import mercadopago from "mercadopago";

const router = express.Router();

router.post("/webhook", async (req, res) => {
  try {
    const topic = req.query.topic || req.body.type;
    const paymentId = req.query.id || req.body.data?.id;

    if (!topic || !paymentId) {
      console.log("⚠ Webhook recibido sin datos útiles");
      return res.sendStatus(200);
    }

    // Solo procesar pagos
    if (topic !== "payment") {
      console.log("Notificación ignorada:", topic);
      return res.sendStatus(200);
    }

    // Obtener info completa del pago
    const result = await mercadopago.payment.get(paymentId);
    const data = result.response;

    console.log("📩 Pago recibido:", data.status);

    // SOLO procesar pagos aprobados
    if (data.status !== "approved") {
      console.log("⚠ Pago NO aprobado, ignorado:", data.status);
      return res.sendStatus(200);
    }

    // Obtener el pedido asociado
    const idPedido = data.external_reference;

    if (!idPedido) {
      console.error("❌ No llegó external_reference en el pago");
      return res.sendStatus(200);
    }

    const total = data.transaction_amount;

    // Actualizar pedido a pagado
    await db.query(
      "UPDATE pedidos SET estado = 'Pagado' WHERE idPedido = ?",
      [idPedido]
    );

    // Registrar venta SOLO si no existe
    await db.query(
      `INSERT IGNORE INTO ventas (idPedido, id_metodo_pago, fecha_venta, total)
       VALUES (?, 1, NOW(), ?)`,
      [idPedido, total]
    );

    console.log("✔ Pago acreditado y venta registrada:", idPedido);

    return res.sendStatus(200);

  } catch (err) {
    console.error("❌ Error en webhook:", err);
    return res.sendStatus(500);
  }
});

export default router;

// BACKEND/utils/mercadopago.js

import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: "APP_USR-8685407626589671-120219-5e717a3d5701c13894370642a30a9eee-3035330517",
});

const preference = new Preference(client);

export const generarPreferenciaMP = async (carritoItems, idPedido) => {
  try {
    const items = carritoItems.map(item => ({
      title: item.nombre || "Producto",
      unit_price: Number(item.precio_actual),
      quantity: Number(item.cantidad),
      currency_id: "ARS",
    }));

    const body = {
      items,
      external_reference: String(idPedido),   // NECESARIO PARA EL WEBHOOK

      notification_url: "http://localhost:3000/api/mercadopago/webhook", 
      // ↑ MUY IMPORTANTE PARA QUE TE LLEGUE EL WEBHOOK

      back_urls: {
        success: "http://localhost:5173/success",
        failure: "http://localhost:5173/fail",
        pending: "http://localhost:5173/pending",
      },

    
    };

    const response = await preference.create({ body });
    console.log("Preferencia MP creada:", response);
    return { init_point: response.init_point };

  } catch (error) {
    console.error("ERROR al crear preferencia MP:", error);
    throw new Error("No se pudo crear la preferencia de pago");
  }
};

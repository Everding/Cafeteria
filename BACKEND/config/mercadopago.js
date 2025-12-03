// config/mercadopago.js
import mercadopagoPkg from "mercadopago"; // default import
const mercadopago = mercadopagoPkg;

// Configurar tu Access Token (no se usa 'new MercadoPago')
mercadopago.configurations = {
  access_token: "APP_USR-8685407626589671-120219-5e717a3d5701c13894370642a30a9eee-3035330517"
};

export default mercadopago;

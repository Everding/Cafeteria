import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Carrito.css";
import { useAuth } from "../context/AuthContext.jsx";

const Carrito = () => {
  const { user, tipo, token, loading } = useAuth();
  const [detalle, setDetalle] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarComprobante, setMostrarComprobante] = useState(false);
  const [detalleComprobante, setDetalleComprobante] = useState([]);
  const [metodoPago, setMetodoPago] = useState("mp"); // mp = Mercado Pago (default)


  // Cargar carrito activo
  const cargarCarrito = async () => {
    if (!token || loading) return;
    setCargando(true);
    try {
      console.log("Token usado para cargar carrito:", token);
      const { data: carrito } = await axios.get(
        "http://localhost:3000/api/carrito/activo",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!carrito?.id_carrito) {
        setDetalle([]);
        setCargando(false);
        return;
      }

      const { data: detalles } = await axios.get(
        `http://localhost:3000/api/detalle-carrito/${carrito.id_carrito}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDetalle(detalles || []);
    } catch (error) {
      console.error("Error cargando carrito:", error.response || error);
      setDetalle([]);
    }
    setCargando(false);
  };

  useEffect(() => {
    if (!loading && token) {
      cargarCarrito();
      window.addEventListener("carritoActualizado", cargarCarrito);
    }
    return () => window.removeEventListener("carritoActualizado", cargarCarrito);
  }, [token, loading]);

  // Eliminar un item del carrito
  const eliminarItem = async (id_detalle) => {
    if (!token) return alert("No hay token válido para eliminar el item");
    if (!window.confirm("¿Seguro que deseas eliminar este producto del carrito?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/detalle-carrito/${id_detalle}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.dispatchEvent(new Event("carritoActualizado"));
    } catch (error) {
      console.error("Error al eliminar item:", error.response || error);
    }
  };

  // Manejar pago según tipo de usuario
 const manejarPago = async () => {
  if (!token) return alert("No hay token válido");
  if (!detalle.length) return alert("El carrito está vacío");

  const idCliente = tipo === "clientes" ? (user?.idCliente || user?.id) : null;
  const idUsuarioApp = tipo === "usuariosapp" ? (user?.idUsuarioApp || user?.id) : null;

  if (tipo === "clientes" && !idCliente) return alert("No se pudo identificar al cliente");
  if (tipo === "usuariosapp" && !idUsuarioApp) return alert("No se pudo identificar al usuario app");

  const carritoItems = detalle.map(item => ({
    id_producto: item.id_producto,
    cantidad: item.cantidad,
    precio_actual: item.subtotal,
    nombre: item.nombre_producto || item.nombre_menu || "Producto"
  }));

  const total = carritoItems.reduce((acc, item) => acc + Number(item.precio_actual) * item.cantidad, 0);

  // 🔥 NUEVO: si es usuarioApp, se elige el método
  let idMetodoPago = 1; // Mercado Pago
  if (tipo === "clientes") idMetodoPago = 2; // Efectivo obligatorio
  if (tipo === "usuariosapp" && metodoPago === "efectivo") idMetodoPago = 2;

  const payload = {
    carritoItems,
    id_usuario_app: idUsuarioApp,
    id_cliente: idCliente,
    id_sucursal: 1,
    total,
    estado: "Pendiente",
    id_metodo_pago: idMetodoPago,
  };

  try {
    console.log("Enviando payload unificado:", payload);

    const response = await fetch("http://localhost:3000/api/mercadopago/create_preference", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Respuesta del backend:", data);

    if (data.success && data.init_point) {
      // Mercado Pago
      return (window.location.href = data.init_point);
    }

    if (data.success && data.pedidoId) {
      // Pago en efectivo (cliente o usuarioApp)
      setDetalleComprobante(detalle);
      setMostrarComprobante(true);
      setDetalle([]);
      window.dispatchEvent(new Event("carritoActualizado"));
      return alert("¡Pago en efectivo registrado!");
    }

    alert("Error: " + (data.message || "No se pudo procesar el pago"));

  } catch (error) {
    console.error("Error en pago:", error);
    alert("Error de conexión");
  }
};

  const total = detalle.reduce(
    (acc, item) => acc + Number(item.subtotal || 0) * Number(item.cantidad || 1),
    0
  );

  const totalComprobante = detalleComprobante.reduce(
    (acc, item) => acc + Number(item.subtotal || 0) * Number(item.cantidad || 1),
    0
  );

  if (cargando) return <p>Cargando carrito...</p>;

  return (
    <div className="CarritoBack">
      <div className="carrito-container">
        <h2>Mi Carrito</h2>
        <table className="carrito-tabla">
          <thead>
            <tr>
              <th>Producto / Menú</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {detalle.length > 0 ? (
              detalle.map(item => (
                <tr key={item.id_detalle}>
                  <td>{item.nombre_producto || item.nombre_menu || "Producto desconocido"}</td>
                  <td>{item.cantidad}</td>
                  <td>${Number(item.subtotal).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
                  <td>
                    <button className="btn-eliminar" onClick={() => eliminarItem(item.id_detalle)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="sin-productos">Sin productos agregados</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* SOLO para usuarios app mostrar método de pago */}
        {tipo === "usuariosapp" && (
          <div className="metodo-pago-box">
            <h4>Seleccionar método de pago:</h4>
            <label>
              <input
                type="radio"
                name="pago"
                value="mp"
                checked={metodoPago === "mp"}
                onChange={() => setMetodoPago("mp")}
              />
              Mercado Pago
            </label>

            <label>
              <input
                type="radio"
                name="pago"
                value="efectivo"
                checked={metodoPago === "efectivo"}
                onChange={() => setMetodoPago("efectivo")}
              />
              Efectivo
            </label>
          </div>
        )}



        {detalle.length > 0 && (
          <div className="carrito-total">
            <h3>Total: ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</h3>
            <button className="btn-simular-pago" onClick={manejarPago}>
              {tipo === "clientes" ? "Pagar" : "Pagar"}
            </button>
          </div>
        )}
      </div>

      {/* Modal de comprobante */}
      {mostrarComprobante && (
        <div className="modal-comprobante">
          <div className="modal-contenido">
            <h2>Comprobante de Compra</h2>
            <table>
              <thead>
                <tr>
                  <th>Producto / Menú</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalleComprobante.map(item => (
                  <tr key={item.id_detalle}>
                    <td>{item.nombre_producto || item.nombre_menu || "Producto"}</td>
                    <td>{item.cantidad}</td>
                    <td>${Number(item.subtotal).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2"><strong>Total</strong></td>
                  <td><strong>${totalComprobante.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</strong></td>
                </tr>
              </tbody>
            </table>
            <button className="btn-cerrar" onClick={() => setMostrarComprobante(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;
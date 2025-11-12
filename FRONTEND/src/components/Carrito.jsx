import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Carrito.css";
import { useAuth } from "../context/AuthContext.jsx";

const Carrito = () => {
  const { user, tipo, token, loading } = useAuth();
  const [detalle, setDetalle] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 🔹 Cargar carrito activo
  const cargarCarrito = async () => {
    if (!token || loading) return;
    setCargando(true);

    try {
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
      console.error("Error cargando carrito:", error);
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

  // 🔹 Eliminar un item del carrito
  const eliminarItem = async (id_detalle) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto del carrito?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/detalle-carrito/${id_detalle}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.dispatchEvent(new Event("carritoActualizado"));
    } catch (error) {
      console.error("Error al eliminar item:", error);
    }
  };

  // 🔹 Simular pago y crear pedido
  const simularPago = async () => {
    if (!window.confirm("¿Desea simular el pago de este carrito?")) return;

    try {
      let idCliente = null;
      let idUsuarioApp = null;

      if (tipo === "clientes") idCliente = user.id || user.idCliente;
      else if (tipo === "usuariosapp") idUsuarioApp = user.id || user.idUsuarioApp;

      if (!idCliente && !idUsuarioApp) {
        alert("El usuario no tiene un Id válido para crear pedidos");
        return;
      }

      if (!detalle.length) {
        alert("El carrito está vacío");
        return;
      }

      // 🔹 Mapear items al formato que espera el backend
      const carritoItems = detalle.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio_actual: item.subtotal / item.cantidad // precio unitario
      }));

      const total = carritoItems.reduce((acc, item) => acc + item.cantidad * item.precio_actual, 0);

      const payload = {
        id_cliente: idCliente,
        id_usuario_app: idUsuarioApp,
        id_sucursal: 1,
        total,
        estado: "Pendiente",
        carritoItems,
        id_metodo_pago: 1 // Puedes cambiar esto según la lógica de tu aplicación
      };

      const { data: pedido } = await axios.post(
        "http://localhost:3000/api/pedidos",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🔹 Vaciar carrito activo
      for (let item of detalle) {
        await axios.delete(
          `http://localhost:3000/api/detalle-carrito/${item.id_detalle}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (detalle[0]?.id_carrito) {
        await axios.put(
          `http://localhost:3000/api/carrito/${detalle[0].id_carrito}`,
          { activo: false },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setDetalle([]);
      alert(`Pago simulado exitosamente. Pedido creado con ID: ${pedido.idPedido}`);
    } catch (error) {
      console.error("Error al simular pago:", error);
      alert("Ocurrió un error al simular el pago. Revisa la consola para más detalles.");
    }
  };

  // 🔹 Total
  const total = detalle.reduce((acc, item) => {
    const cantidad = Number(item.cantidad || 1);
    const precioUnitario = Number(item.subtotal / cantidad || 0);
    return acc + cantidad * precioUnitario;
  }, 0);

  if (cargando) return <p>Cargando carrito...</p>;

  return (
    <div className="CarritoBack">
      <div className="carrito-container">
        <h2>🛒 Mi Carrito</h2>
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
              detalle.map((item) => {
                const cantidad = Number(item.cantidad || 1);
                const subtotal = Number(item.subtotal || 0);

                return (
                  <tr key={item.id_detalle}>
                    <td>{item.nombre_producto || item.nombre_menu || "Producto desconocido"}</td>
                    <td>{cantidad}</td>
                    <td>${subtotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
                    <td>
                      <button className="btn-eliminar" onClick={() => eliminarItem(item.id_detalle)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="sin-productos">🌀 Sin productos agregados</td>
              </tr>
            )}
          </tbody>
        </table>

        {detalle.length > 0 && (
          <div className="carrito-total">
            <h3>Total: ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</h3>
            <button className="btn-simular-pago" onClick={simularPago}>
              Simular pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrito;

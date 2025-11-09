import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Carrito.css";
import { useAuth } from "../context/AuthContext.jsx";

const Carrito = () => {
  const { token, loading } = useAuth();
  const [detalle, setDetalle] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarCarrito = async () => {
    if (!token) return;
    setCargando(true);

    try {
      // 🔹 Obtener carrito activo
      const { data: carrito } = await axios.get(
        "http://localhost:3000/api/carrito/activo",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!carrito?.id_carrito) {
        setDetalle([]);
        setCargando(false);
        return;
      }

      // 🔹 Obtener detalles del carrito
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

  // 🔹 Total considerando cantidad y precio unitario
  const total = detalle.reduce((acc, item) => {
    const cantidad = Number(item.cantidad || 1);
    const precioUnitario = Number(item.precio_actual || item.subtotal || 0);
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
                const precioUnitario = Number(item.precio_actual || item.subtotal || 0);
                const subtotal = cantidad * precioUnitario;

                return (
                  <tr key={item.id_detalle}>
                    <td>{item.nombre_producto || item.nombre_menu || "Producto desconocido"}</td>
                    <td>{cantidad}</td>
                    <td>
                      ${subtotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </td>
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
            <h3>Total: $
              {total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrito;

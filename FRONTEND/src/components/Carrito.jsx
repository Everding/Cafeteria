import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Carrito.css";

const Carrito = ({ idCarrito }) => {
  const [detalle, setDetalle] = useState([]);

  // Cargar productos desde la BD
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/detalle-carrito/${idCarrito}`)
      .then((res) => setDetalle(res.data))
      .catch((err) => console.error("Error cargando carrito:", err));
  }, [idCarrito]);

  // Eliminar producto del carrito
  const eliminarItem = async (id_detalle) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto del carrito?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/detalle-carrito/${id_detalle}`);
      setDetalle(detalle.filter((item) => item.id_detalle !== id_detalle));
      window.dispatchEvent(new Event("carritoActualizado"));
    } catch (error) {
      console.error("Error al eliminar item:", error);
    }
  };

  // Calcular total — convertimos subtotal a número real
  const total = detalle.reduce((acc, item) => acc + Number(item.subtotal || 0), 0);

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
              detalle.map((item) => (
                <tr key={item.id_detalle}>
                  <td>
                    {item.nombre_producto
                      ? item.nombre_producto
                      : item.nombre_menu
                      ? item.nombre_menu
                      : `Producto #${item.id_producto || item.id_menu_prefabricado}`}
                  </td>
                  <td>{item.cantidad}</td>
                  <td>
                    $
                    {Number(item.subtotal).toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarItem(item.id_detalle)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="sin-productos">
                  💤 Sin productos agregados
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {detalle.length > 0 && (
          <div className="carrito-total">
            <h3>
              Total: $
              {total.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrito;

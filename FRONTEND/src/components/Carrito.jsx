import React from "react";
import "../styles/Carrito.css";

const Carrito = ({ detalle = [], setDetalle }) => {
  // Eliminar un producto del carrito
  const eliminarItem = (id_detalle) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto del carrito?")) return;
    setDetalle(detalle.filter((item) => item.id_detalle !== id_detalle));
  };

  // Total del carrito
  const total = detalle.reduce((acc, item) => acc + item.subtotal, 0);

  return (
<div className="CarritoBack">
    <div className="carrito-container">
      <h2>Mi Carrito</h2>

      <table className="carrito-tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {detalle.length > 0 ? (
            detalle.map((item) => (
              <tr key={item.id_detalle}>
                <td>{item.nombre}</td>
                <td>{item.cantidad}</td>
                <td>${item.subtotal}</td>
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
          <h3>Total: ${total}</h3>
        </div>
      )}
    </div>    
</div>
  );
};

export default Carrito;

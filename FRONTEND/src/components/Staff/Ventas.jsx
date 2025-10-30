import React, { useState } from 'react';
import '../../styles/Staff/Ventas.css';

const Ventas = () => {
  // Datos locales de ejemplo (simulando lo que vendría del backend)
  const [ventas] = useState([
    { idVenta: 1, idPedido: 101, id_metodo_pago: 1, fecha_venta: '2025-10-28', total: 1800 },
    { idVenta: 2, idPedido: 102, id_metodo_pago: 2, fecha_venta: '2025-10-28', total: 2200 },
    { idVenta: 3, idPedido: 103, id_metodo_pago: 3, fecha_venta: '2025-10-27', total: 900 },
  ]);

  // Simulamos pedidos para obtener usuario/mesa y productos
  const pedidos = {
    101: { usuario: 'Juan Pérez', productos: 'Café con leche, Medialuna' },
    102: { usuario: 'Mesa 3', productos: 'Capuchino, Brownie' },
    103: { usuario: 'Lucía Torres', productos: 'Té verde' },
  };

  // Simulamos métodos de pago
  const metodosPago = {
    1: 'Efectivo',
    2: 'Tarjeta',
    3: 'MercadoPago',
  };

  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [paginaActual, setPaginaActual] = useState(1);
  const ventasPorPagina = 10;

  // Filtrar ventas por fecha
  const ventasFiltradas = ventas.filter(v => v.fecha_venta === fechaSeleccionada);

  // Paginación
  const totalPaginas = Math.ceil(ventasFiltradas.length / ventasPorPagina);
  const inicio = (paginaActual - 1) * ventasPorPagina;
  const ventasPaginadas = ventasFiltradas.slice(inicio, inicio + ventasPorPagina);

  // Total del día
  const totalDelDia = ventasFiltradas.reduce((acc, v) => acc + v.total, 0);

  // Filas vacías para mantener alto fijo
  const filasVacias = Array(Math.max(0, ventasPorPagina - ventasPaginadas.length)).fill(null);

  return (
    <div className="ventas-container">
      <h2>Ventas del Día ({fechaSeleccionada})</h2>

      {/* Selector de fecha */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <label htmlFor="fecha">Seleccionar fecha: </label>
        <input
          type="date"
          id="fecha"
          value={fechaSeleccionada}
          onChange={(e) => { setFechaSeleccionada(e.target.value); setPaginaActual(1); }}
        />
      </div>

      <table className="ventas-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Usuario / Mesa</th>
            <th>Método de Pago</th>
            <th>Productos</th>
            <th>Total ($)</th>
          </tr>
        </thead>
        <tbody>
          {ventasPaginadas.length > 0 ? (
            ventasPaginadas.map(v => (
              <tr key={v.idVenta}>
                <td>{v.idVenta}</td>
                <td>{v.fecha_venta}</td>
                <td>{pedidos[v.idPedido]?.usuario || 'N/A'}</td>
                <td>{metodosPago[v.id_metodo_pago] || 'N/A'}</td>
                <td>{pedidos[v.idPedido]?.productos || ''}</td>
                <td>{v.total.toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No hay ventas registradas en esta fecha</td>
            </tr>
          )}

          {/* Filas vacías */}
          {filasVacias.map((_, i) => (
            <tr key={`vacia-${i}`}><td colSpan="6" style={{ height: '40px', background: '#fff' }}></td></tr>
          ))}

          {/* Total del día */}
          {ventasFiltradas.length > 0 && (
            <tr className="total-fila">
              <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total del Día:</td>
              <td style={{ fontWeight: 'bold' }}>${totalDelDia.toLocaleString()}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setPaginaActual(p => Math.max(p - 1, 1))}
          disabled={paginaActual === 1}
        >
          ◀ Anterior
        </button>
        <span>Página {paginaActual} de {totalPaginas || 1}</span>
        <button
          onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas || totalPaginas === 0}
        >
          Siguiente ▶
        </button>
      </div>
    </div>
  );
};

export default Ventas;

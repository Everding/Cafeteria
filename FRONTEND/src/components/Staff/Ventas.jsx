import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Staff/Ventas.css';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [paginaActual, setPaginaActual] = useState(1);
  const ventasPorPagina = 10;

  // 🔹 Cargar ventas desde backend
  const cargarVentas = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/ventas'); // tu endpoint getAllVentas
      setVentas(data);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  // 🔹 Filtrar por fecha
  const ventasFiltradas = ventas.filter(v => v.fecha_venta?.split('T')[0] === fechaSeleccionada);

  // 🔹 Paginación
  const totalPaginas = Math.ceil(ventasFiltradas.length / ventasPorPagina);
  const inicio = (paginaActual - 1) * ventasPorPagina;
  const ventasPaginadas = ventasFiltradas.slice(inicio, inicio + ventasPorPagina);

  // 🔹 Total del día
  const totalDelDia = ventasFiltradas.reduce((acc, v) => acc + Number(v.total), 0);

  return (
    <div className="ventas-container">
      <h2>Ventas del Día ({fechaSeleccionada})</h2>

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
            <th>ID Venta</th>
            <th>ID Pedido</th>
            <th>Cliente / Usuario</th>
            <th>Método de Pago</th>
            <th>Total ($)</th>
          </tr>
        </thead>
        <tbody>
          {ventasPaginadas.length > 0 ? (
            ventasPaginadas.map(v => (
              <tr key={v.idVenta}>
                <td>{v.idVenta}</td>
                <td>{v.idPedido}</td>
                <td>{v.usuario_app || v.cliente || 'N/A'}</td>
                <td>{v.metodo_pago || 'N/A'}</td>
                <td>{Number(v.total).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No hay ventas registradas en esta fecha</td>
            </tr>
          )}
        </tbody>
        {ventasFiltradas.length > 0 && (
          <tfoot>
            <tr className="total-fila">
              <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total del Día:</td>
              <td style={{ fontWeight: 'bold' }}>${totalDelDia.toLocaleString()}</td>
            </tr>
          </tfoot>
        )}
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

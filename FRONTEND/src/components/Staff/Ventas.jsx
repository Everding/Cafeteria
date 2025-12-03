import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Staff/Ventas.css';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [modoReporte, setModoReporte] = useState('diario'); // 'diario' o 'rango'
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);
  const [paginaActual, setPaginaActual] = useState(1);
  const ventasPorPagina = 10;

  // 🔹 Cargar ventas desde backend
  const cargarVentas = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/ventas');
      setVentas(data);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  // 🔹 Filtrar ventas según el modo seleccionado
  const ventasFiltradas = ventas.filter(v => {
    if (!v.fecha_venta) return false;
    const fechaVenta = new Date(v.fecha_venta.split('T')[0]);

    if (modoReporte === 'diario') {
      const fecha = new Date(fechaSeleccionada);
      return fechaVenta.getTime() === fecha.getTime();
    } else {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      return fechaVenta >= inicio && fechaVenta <= fin;
    }
  });

  // 🔹 Paginación
  const totalPaginas = Math.ceil(ventasFiltradas.length / ventasPorPagina);
  const inicioIndex = (paginaActual - 1) * ventasPorPagina;
  const ventasPaginadas = ventasFiltradas.slice(inicioIndex, inicioIndex + ventasPorPagina);

  // 🔹 Total del período
  const totalPeriodo = ventasFiltradas.reduce((acc, v) => acc + Number(v.total), 0);

  return (
    <div className="ventas-container">
      <h2>Reporte de Ventas</h2>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <label htmlFor="modoReporte">Modo de reporte: </label>
        <select
          id="modoReporte"
          value={modoReporte}
          onChange={(e) => { setModoReporte(e.target.value); setPaginaActual(1); }}
        >
          <option value="diario">Diario</option>
          <option value="rango">Desde/Hasta</option>
        </select>
      </div>

      {modoReporte === 'diario' ? (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <label htmlFor="fecha">Seleccionar fecha: </label>
          <input
            type="date"
            id="fecha"
            value={fechaSeleccionada}
            onChange={(e) => { setFechaSeleccionada(e.target.value); setPaginaActual(1); }}
          />
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <label htmlFor="fechaInicio">Desde: </label>
          <input
            type="date"
            id="fechaInicio"
            value={fechaInicio}
            onChange={(e) => { setFechaInicio(e.target.value); setPaginaActual(1); }}
          />
          <label htmlFor="fechaFin" style={{ marginLeft: '10px' }}>Hasta: </label>
          <input
            type="date"
            id="fechaFin"
            value={fechaFin}
            onChange={(e) => { setFechaFin(e.target.value); setPaginaActual(1); }}
          />
        </div>
      )}

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
              <td colSpan="5" style={{ textAlign: 'center' }}>No hay ventas registradas</td>
            </tr>
          )}
        </tbody>
        {ventasFiltradas.length > 0 && (
          <tfoot>
            <tr className="total-fila">
              <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
              <td style={{ fontWeight: 'bold' }}>${totalPeriodo.toLocaleString()}</td>
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

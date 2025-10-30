import React, { useState } from 'react';
import '../../styles/Staff/Compras.css';

const Compras = () => {
  const [compras, setCompras] = useState([
    { id: 1, fecha: '2025-10-25', proveedor: 'Café del Norte', compra: '50 kg de café', total: 25000 },
    { id: 2, fecha: '2025-10-26', proveedor: 'Lácteos La Vaquita', compra: '100 L de leche', total: 18000 },
    { id: 3, fecha: '2025-10-27', proveedor: 'Dulce Aroma', compra: '20 kg de azúcar', total: 6000 },
  ]);

  const [nuevaCompra, setNuevaCompra] = useState({
    fecha: '',
    proveedor: '',
    compra: '',
    total: '',
  });

  const [editando, setEditando] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const comprasPorPagina = 10;

  const totalPaginas = Math.ceil(compras.length / comprasPorPagina);
  const inicio = (paginaActual - 1) * comprasPorPagina;
  const comprasPaginadas = compras.slice(inicio, inicio + comprasPorPagina);

  const handleChange = (e) => {
    setNuevaCompra({
      ...nuevaCompra,
      [e.target.name]: e.target.value,
    });
  };

  const agregarCompra = () => {
    if (!nuevaCompra.fecha || !nuevaCompra.proveedor || !nuevaCompra.compra || !nuevaCompra.total)
      return alert('Por favor complete todos los campos');

    if (editando !== null) {
      // Guardar cambios
      setCompras((prev) =>
        prev.map((c) =>
          c.id === editando ? { ...c, ...nuevaCompra, total: parseFloat(nuevaCompra.total) } : c
        )
      );
      setEditando(null);
    } else {
      // Crear nueva compra
      const nuevoId = Math.max(...compras.map((c) => c.id)) + 1;
      setCompras([...compras, { id: nuevoId, ...nuevaCompra, total: parseFloat(nuevaCompra.total) }]);
    }

    setNuevaCompra({ fecha: '', proveedor: '', compra: '', total: '' });
  };

  const editarCompra = (id) => {
    const compra = compras.find((c) => c.id === id);
    setNuevaCompra(compra);
    setEditando(id);
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setNuevaCompra({ fecha: '', proveedor: '', compra: '', total: '' });
  };

  const eliminarCompra = (id) => {
    const confirmacion = window.confirm('¿Estás seguro de eliminar este registro?');
    if (!confirmacion) return;
    setCompras((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="compras-container">
      <h2>Registro de Compras a Proveedores</h2>

      <div className="compras-form">
        <input
          type="date"
          name="fecha"
          value={nuevaCompra.fecha}
          onChange={handleChange}
          placeholder="Fecha"
        />
        <input
          type="text"
          name="proveedor"
          value={nuevaCompra.proveedor}
          onChange={handleChange}
          placeholder="Proveedor"
        />
        <input
          type="text"
          name="compra"
          value={nuevaCompra.compra}
          onChange={handleChange}
          placeholder="Compra realizada"
        />
        <input
          type="number"
          name="total"
          value={nuevaCompra.total}
          onChange={handleChange}
          placeholder="Total ($)"
        />

        <div className="compras-buttons">
          <button onClick={agregarCompra}>
            {editando ? 'Guardar Cambios' : 'Agregar Compra'}
          </button>
          {editando && (
            <button className="btn-cancelar" onClick={cancelarEdicion}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <table className="compras-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Proveedor</th>
            <th>Compra</th>
            <th>Total ($)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comprasPaginadas.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.fecha}</td>
              <td>{c.proveedor}</td>
              <td>{c.compra}</td>
              <td>{c.total.toLocaleString()}</td>
              <td>
                <button className="btn-editar" onClick={() => editarCompra(c.id)}>
                  Editar
                </button>
                <button className="btn-eliminar" onClick={() => eliminarCompra(c.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
          disabled={paginaActual === 1}
        >
          ◀ Anterior
        </button>
        <span>
          Página {paginaActual} de {totalPaginas}
        </span>
        <button
          onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
        >
          Siguiente ▶
        </button>
      </div>
    </div>
  );
};

export default Compras;

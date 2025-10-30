import React, { useState } from 'react';
import '../../styles/Staff/Stock.css';

const Stock = () => {
  const categorias = ['Bebidas', 'Postres', 'Kiosco', 'Acompañantes'];

  const [materiasPrimas, setMateriasPrimas] = useState([
    { idMateriaPrima: 1, nombre: 'Café', categoria: 'Bebidas', cantidad: 50 },
    { idMateriaPrima: 2, nombre: 'Leche', categoria: 'Bebidas', cantidad: 30 },
    { idMateriaPrima: 3, nombre: 'Azúcar', categoria: 'Bebidas', cantidad: 100 },
    { idMateriaPrima: 4, nombre: 'Chocolate', categoria: 'Postres', cantidad: 20 },
    { idMateriaPrima: 5, nombre: 'Galleta', categoria: 'Postres', cantidad: 40 },
    { idMateriaPrima: 6, nombre: 'Pan', categoria: 'Kiosco', cantidad: 25 },
  ]);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categorias[0]);

  const materiasFiltradas = materiasPrimas.filter(
    (mp) => mp.categoria === categoriaSeleccionada
  );

  const eliminarMateriaPrima = (id) => {
    setMateriasPrimas((prev) => prev.filter((mp) => mp.idMateriaPrima !== id));
  };

  // Nueva lógica para agregar materia prima con select de categoría
  const agregarMateriaPrima = () => {
    const nombre = prompt('Ingrese el nombre de la nueva materia prima:');
    if (!nombre) return;

    const cantidad = parseInt(prompt('Ingrese la cantidad inicial:'), 10);
    if (isNaN(cantidad)) return alert('Cantidad inválida');

    // Mostrar un select con categorías disponibles
    const categoria = prompt(
      `Seleccione la categoría escribiendo el número:\n${categorias
        .map((cat, i) => `${i + 1}. ${cat}`)
        .join('\n')}`
    );

    const index = parseInt(categoria, 10) - 1;
    if (isNaN(index) || index < 0 || index >= categorias.length)
      return alert('Categoría inválida');

    const nuevoId = Math.max(...materiasPrimas.map((mp) => mp.idMateriaPrima)) + 1;

    setMateriasPrimas((prev) => [
      ...prev,
      { idMateriaPrima: nuevoId, nombre, categoria: categorias[index], cantidad },
    ]);
  };

  return (
    <div className='Stock-Principal'>
        <div className="stock-container">
      <h2>Stock de Materias Primas</h2>

      <div className="stock-actions">
        <button onClick={agregarMateriaPrima}>Agregar Materia Prima</button>
      </div>

      <div className="categoria-select">
        <label>Filtrar por categoría: </label>
        <select
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <table className="stock-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cantidad Disponible</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materiasFiltradas.map((mp) => (
            <tr key={mp.idMateriaPrima}>
              <td>{mp.idMateriaPrima}</td>
              <td>{mp.nombre}</td>
              <td>{mp.cantidad}</td>
              <td>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarMateriaPrima(mp.idMateriaPrima)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

};

export default Stock;

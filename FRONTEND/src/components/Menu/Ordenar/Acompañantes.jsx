import React, { useState } from 'react';
import AcompanantesCard from './AcompañantesCard';
import '../../../styles/Menu/Acompañantes.css';

const Acompanantes = () => {
  const [products, setProducts] = useState([
    { id: 1, title: 'Papas Fritas', description: 'Crujientes papas fritas', image: 'https://via.placeholder.com/120', price: 80, subcategoria: 'Papas' },
    { id: 2, title: 'Ensalada César', description: 'Lechuga, pollo, queso y aderezo', image: 'https://via.placeholder.com/120', price: 120, subcategoria: 'Ensaladas' }
  ]);

  const [filtroSubcategoria, setFiltroSubcategoria] = useState('Todas');

  const agregarProducto = () => {
    const newProduct = { id: Date.now(), title: 'Nuevo Producto', description: 'Descripción', image: 'https://via.placeholder.com/120', price: 0, subcategoria: 'Sin categoría' };
    setProducts([newProduct, ...products]);
  };

  const actualizarProducto = (id, datosActualizados) => {
    setProducts(products.map(p => (p.id === id ? { ...p, ...datosActualizados } : p)));
  };

  const eliminarProducto = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const subcategoriasUnicas = ['Todas', ...Array.from(new Set(products.map(p => p.subcategoria)))];

  const productosFiltrados = filtroSubcategoria === 'Todas'
    ? products
    : products.filter(p => p.subcategoria === filtroSubcategoria);

  return (
    <div className="AcompanantesPage">
      <div className="AcompanantesPage-header">
        <h2>Acompañantes</h2>
        <button className="AcompanantesPage-addProduct" onClick={agregarProducto}>Agregar Producto</button>
      </div>

      <div className="AcompanantesPage-filter">
        <label>Filtrar por subcategoría: </label>
        <select value={filtroSubcategoria} onChange={e => setFiltroSubcategoria(e.target.value)}>
          {subcategoriasUnicas.map((sub, idx) => (
            <option key={idx} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      <div className="AcompanantesPage-container">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map(product => (
            <AcompanantesCard
              key={product.id}
              product={product}
              onUpdate={actualizarProducto}
              onDelete={eliminarProducto}
            />
          ))
        ) : (
          <p>No hay acompañantes en esta subcategoría.</p>
        )}
      </div>
    </div>
  );
};

export default Acompanantes;

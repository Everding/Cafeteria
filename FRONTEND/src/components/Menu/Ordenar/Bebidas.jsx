import React, { useState } from 'react';
import BebidasCard from './BebidasCard';
import '../../../styles/Menu/Bebidas.css';

const Bebidas = () => {
  // Productos de ejemplo
  const [products, setProducts] = useState([
    { id: 1, title: 'Café Espresso', description: 'Café intenso y aromático', image: 'https://via.placeholder.com/120', price: 150, subcategoria: 'Café' },
    { id: 2, title: 'Té Verde', description: 'Té saludable y relajante', image: 'https://via.placeholder.com/120', price: 120, subcategoria: 'Té' },
    { id: 3, title: 'Jugo de Naranja', description: 'Jugo natural recién exprimido', image: 'https://via.placeholder.com/120', price: 100, subcategoria: 'Jugo' },
    { id: 4, title: 'Chocolate Caliente', description: 'Bebida caliente y dulce', image: 'https://via.placeholder.com/120', price: 130, subcategoria: 'Chocolate' }
  ]);

  const [filtroSubcategoria, setFiltroSubcategoria] = useState('Todas');

  const agregarProducto = () => {
    const newProduct = { id: Date.now(), title: 'Nueva Bebida', description: 'Descripción', image: 'https://via.placeholder.com/120', price: 0, subcategoria: 'Sin categoría' };
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
    <div className="BebidasPage">
      <div className="BebidasPage-header">
        <h2>Bebidas</h2>
        <button className="BebidasPage-addProduct" onClick={agregarProducto}>Agregar Bebida</button>
      </div>

      <div className="BebidasPage-filter">
        <label>Filtrar por subcategoría: </label>
        <select value={filtroSubcategoria} onChange={e => setFiltroSubcategoria(e.target.value)}>
          {subcategoriasUnicas.map((sub, idx) => (
            <option key={idx} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      <div className="BebidasPage-container">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map(product => (
            <BebidasCard
              key={product.id}
              product={product}
              onUpdate={actualizarProducto}
              onDelete={eliminarProducto}
            />
          ))
        ) : (
          <p>No hay bebidas en esta subcategoría.</p>
        )}
      </div>
    </div>
  );
};

export default Bebidas;

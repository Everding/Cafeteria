import React, { useState } from 'react';
import PostresCard from './PostresCard';
import '../../../styles/Menu/Postres.css';

const Postres = () => {
  // Productos de ejemplo
  const [products, setProducts] = useState([
    { id: 1, title: 'Brownie', description: 'Delicioso brownie de chocolate', image: 'https://via.placeholder.com/120', price: 200, subcategoria: 'Torta' },
    { id: 2, title: 'Helado', description: 'Helado cremoso de vainilla', image: 'https://via.placeholder.com/120', price: 150, subcategoria: 'Postre frío' },
    { id: 3, title: 'Galleta', description: 'Galleta de avena con chispas de chocolate', image: 'https://via.placeholder.com/120', price: 100, subcategoria: 'Galleta' },
    { id: 4, title: 'Tiramisu', description: 'Postre italiano clásico', image: 'https://via.placeholder.com/120', price: 220, subcategoria: 'Postre frío' }
  ]);

  const [filtroSubcategoria, setFiltroSubcategoria] = useState('Todas');

  // Funciones para actualizar, agregar o eliminar productos
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

  // Obtener subcategorías únicas para el select
  const subcategoriasUnicas = ['Todas', ...Array.from(new Set(products.map(p => p.subcategoria)))];

  // Filtrar productos según la subcategoría seleccionada
  const productosFiltrados = filtroSubcategoria === 'Todas'
    ? products
    : products.filter(p => p.subcategoria === filtroSubcategoria);

  return (
    <div className="PostresPage">
      <div className="PostresPage-header">
        <h2>Postres</h2>
        <button className="PostresPage-addProduct" onClick={agregarProducto}>Agregar Producto</button>
      </div>

      {/* Select de filtro por subcategoría */}
      <div className="PostresPage-filter">
        <label>Filtrar por subcategoría: </label>
        <select value={filtroSubcategoria} onChange={e => setFiltroSubcategoria(e.target.value)}>
          {subcategoriasUnicas.map((sub, idx) => (
            <option key={idx} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      <div className="PostresPage-container">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map(product => (
            <PostresCard
              key={product.id}
              product={product}
              onUpdate={actualizarProducto}
              onDelete={eliminarProducto}
            />
          ))
        ) : (
          <p>No hay postres en esta subcategoría.</p>
        )}
      </div>
    </div>
  );
};

export default Postres;

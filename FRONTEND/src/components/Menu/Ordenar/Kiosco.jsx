import React, { useState } from 'react';
import KioscoCard from './KioscoCard';
import '../../../styles/Menu/Kiosco.css';

const Kiosco = () => {
  const [products, setProducts] = useState([
    { id: 1, title: 'Chocolatina', description: 'Chocolate con leche', image: 'https://via.placeholder.com/120', price: 50, subcategoria: 'Chocolates' },
    { id: 2, title: 'Gomitas', description: 'Gomitas de frutas', image: 'https://via.placeholder.com/120', price: 40, subcategoria: 'Golosinas' }
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
    <div className="KioscoPage">
      <div className="KioscoPage-header">
        <h2>Kiosco</h2>
        <button className="KioscoPage-addProduct" onClick={agregarProducto}>Agregar Producto</button>
      </div>

      <div className="KioscoPage-filter">
        <label>Filtrar por subcategoría: </label>
        <select value={filtroSubcategoria} onChange={e => setFiltroSubcategoria(e.target.value)}>
          {subcategoriasUnicas.map((sub, idx) => (
            <option key={idx} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      <div className="KioscoPage-container">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map(product => (
            <KioscoCard
              key={product.id}
              product={product}
              onUpdate={actualizarProducto}
              onDelete={eliminarProducto}
            />
          ))
        ) : (
          <p>No hay productos en esta subcategoría.</p>
        )}
      </div>
    </div>
  );
};

export default Kiosco;

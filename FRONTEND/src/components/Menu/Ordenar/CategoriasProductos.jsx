import React from 'react';
import CategoriasCard from './CategoriasCard';
import '../../../styles/Menu/CategoriasProductos.css';

const Categoriasproductos = () => {
  const categories = [
    { id: 1, name: 'Bebidas', path: '/bebidas', image: 'https://i.pinimg.com/736x/67/1f/bf/671fbfa08a492df0befb49d1e9adf8cb.jpg' },
    { id: 2, name: 'Acompañantes', path: '/acompanantes', image: 'https://cdn-icons-png.flaticon.com/512/98/98032.png' },
    { id: 3, name: 'Postres', path: '/postres', image: 'https://thumbs.dreamstime.com/b/icono-de-rebanada-tarta-signo-ilustraci%C3%B3n-vector-fresa-negra-la-chocolate-dibujada-mano-pastel-negro-y-blanco-con-vectorial-212384527.jpg' },
    { id: 4, name: 'Kiosco', path: '/snacks', image: 'https://static.vecteezy.com/system/resources/previews/015/221/720/non_2x/street-kiosk-icon-simple-style-vector.jpg' },
  ];

  return (
    <div className="container">
      <div className="header">CATEGORÍAS</div>
      <div className="category-grid">
        {categories.map((category) => (
          <CategoriasCard
            key={category.id}
            name={category.name}
            path={category.path}
            image={category.image}
          />
        ))}
      </div>
    </div>
  );
};

export default Categoriasproductos;

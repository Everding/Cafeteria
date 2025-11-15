import React from 'react';
import CategoriasCard from './CategoriasCard';
import '../../../styles/Menu/CategoriasProductos.css';

const Categoriasproductos = () => {
  const categories = [
    { id: 1, name: 'Bebidas', path: '/bebidas', image: 'https://media.discordapp.net/attachments/1417942954948956321/1431811826122756267/CategoriaBebidas.jpg?ex=6919cced&is=69187b6d&hm=59a88cba573543a63fe7ad1219bffa4d7813811de16f1170fcd96abca5ccc9a3&=&format=webp&width=788&height=788' },
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

import React from 'react';
import CategoriasCard from './CategoriasCard';
import '../../../styles/Menu/CategoriasProductos.css';

const Categoriasproductos = () => {
  const categories = [
    { id: 1, name: 'Bebidas', path: '/bebidas', image: 'https://media.discordapp.net/attachments/1417942954948956321/1431811826122756267/CategoriaBebidas.jpg?ex=68fec62d&is=68fd74ad&hm=0b60a94d8c6a333a86dba63e7d30779645dd01ff1b9ab9919d60a00468ec6f79&=&format=webp&width=847&height=847' },
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

import React from 'react';
import '../styles/Menu/NuestrosProductos.css';

const productos = [
  { id: 1, nombre: 'Café Espresso', descripcion: 'Un café intenso y aromático, preparado con granos 100% arábica.', precio: '$1500', imagen: 'https://www.marketresearchintellect.com/images/blogs/sipping-success-exploring-the-dynamics-of-the-espresso-coffee-market.webp' },
  { id: 2, nombre: 'Café Latte', descripcion: 'Delicioso café con leche, espumoso y cremoso, ideal para tu tarde.', precio: '$1800', imagen: 'https://gastrodome.com.my/wp-content/uploads/2025/04/cafe-latte-recipe-1745063911.jpg' },
  { id: 3, nombre: 'Cappuccino', descripcion: 'Café clásico italiano con espuma de leche y toque de cacao.', precio: '$2000', imagen: 'https://dreamfactorycatalogo.com/wp-content/uploads/2024/10/capuchino.jpg' },
  { id: 4, nombre: 'Mocaccino', descripcion: 'Café con chocolate y leche, perfecto para los amantes del dulce.', precio: '$2200', imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Mocha.jpg/1200px-Mocha.jpg' },
  { id: 5, nombre: 'Té Verde', descripcion: 'Infusión ligera y refrescante, rica en antioxidantes.', precio: '$1200', imagen: 'https://mejorconsalud.as.com/wp-content/uploads/2021/12/bebida-te-verde.jpg' },
  { id: 6, nombre: 'Té Chai Latte', descripcion: 'Delicioso té especiado con leche, un clásico reconfortante.', precio: '$1800', imagen: 'https://www.shoothecook.es/wp-content/uploads/te-chai-receta-f.jpg' },
  { id: 7, nombre: 'Galletas de Chocolate', descripcion: 'Galletas recién horneadas, crujientes por fuera y suaves por dentro.', precio: '$800', imagen: 'https://mojo.generalmills.com/api/public/content/3Wt-TSe6c0a57iCvwOTXtQ_gmi_hi_res_jpeg.jpeg?v=bd45f6e7&t=16e3ce250f244648bef28c5949fb99ff' },
  { id: 8, nombre: 'Brownie', descripcion: 'Brownie de chocolate con nueces, ideal para acompañar tu café.', precio: '$1000', imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7cvXG2WLgXCC-mfERCD7DO24z0XEZCGODqQ&s' },
  { id: 9, nombre: 'Muffin de Arándanos', descripcion: 'Muffin suave y esponjoso con arándanos frescos.', precio: '$900', imagen: 'https://www.recetassinlactosa.com/wp-content/uploads/2017/12/Muffins-de-arandanos.jpg' },
  { id: 10, nombre: 'Sándwich Club', descripcion: 'Sándwich clásico con jamón, pollo, lechuga y tomate.', precio: '$2500', imagen: 'https://d2j9trpqxd6hrn.cloudfront.net/uploads/recipe/main_image/511/sandwich_club.jpg' },
];

const NuestrosProductos = () => {
  return (
    <div className="primer-div">
      <h2 id="Titulo">Nuestros Productos</h2>
      {productos.map((producto, index) => (
        <div
          key={producto.id}
          className={index % 2 === 0 ? 'Parrafo-imagenizquierda' : 'Parrafo-imagenderecha'}
        >
          <img src={producto.imagen} alt={producto.nombre} className="imagen" />
          <div className="parrafo">
            <div className="producto-header">
              <h3 className="producto-nombre">{producto.nombre}</h3>
              <p className="producto-precio">{producto.precio}</p>
            </div>
            <p className="producto-descripcion">{producto.descripcion}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NuestrosProductos;
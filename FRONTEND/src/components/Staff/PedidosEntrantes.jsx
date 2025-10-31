import React, { useState, useEffect } from 'react';
import '../../styles/Staff/PedidosEntrantes.css';

const PedidosEntrantes = () => {
  const [comandas, setComandas] = useState([]);

  useEffect(() => {
    const datosSimulados = [
      {
        id: 1,
        cliente: 'Nombre de hombre 1',
        imagen: 'https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVyc29uYXxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000',
        productos: [
          { nombre: 'Café Latte', cantidad: 2 },
          { nombre: 'Medialunas', cantidad: 3 },
        ],
        estado: 'Pendiente',
      },
      {
        id: 2,
        cliente: 'Nombre de mujer 1',
        imagen: 'https://www.dzoom.org.es/wp-content/uploads/2020/02/portada-foto-perfil-redes-sociales-consejos.jpg',
        productos: [
          { nombre: 'Tostado de Jamón y Queso', cantidad: 1 },
          { nombre: 'Jugo de Naranja', cantidad: 1 },
        ],
        estado: 'Entregado',
      },
      {
        id: 3,
        cliente: 'Nombre de hombre 2',
        imagen: 'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyZmlsfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000',
        productos: [
          { nombre: 'Capuccino', cantidad: 1 },
          { nombre: 'Brownie', cantidad: 2 },
        ],
        estado: 'Cancelado',
      },
    ];

    setComandas(datosSimulados);
  }, []);

  const cambiarEstado = (id) => {
    setComandas((prev) =>
      prev.map((comanda) =>
        comanda.id === id && comanda.estado === 'Pendiente'
          ? { ...comanda, estado: 'Entregado' }
          : comanda
      )
    );
  };

  return (
    <div className="pedidos-container">
      <h2 className="pedidos-titulo">Pedidos Entrantes</h2>

      <div className="pedidos-lista">
        {comandas.map((comanda) => (
          <div key={comanda.id} className={`comanda-card ${comanda.estado.toLowerCase()}`}>
           
            <div className="comanda-cliente">
              <img src={comanda.imagen} alt={comanda.cliente} className="cliente-foto" />
              <p className="cliente-nombre">{comanda.cliente}</p>
            </div>

           
            <div className="comanda-separador"></div>

        
            <div className="comanda-detalle">
              <h3>Pedido</h3>
              <ul className="comanda-productos">
                {comanda.productos.map((p, index) => (
                  <li key={index}>
                    {p.cantidad}x {p.nombre}
                  </li>
                ))}
              </ul>
            </div>

        
            <div className="comanda-estado">
              <h3>Estado:</h3>
              <p className={`estado-texto estado-${comanda.estado.toLowerCase()}`}>
                {comanda.estado}
              </p>
            </div>

            {comanda.estado === 'Pendiente' && (
              <button
                className="boton-entregado"
                onClick={() => cambiarEstado(comanda.id)}
              >
                Marcar como Entregado
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PedidosEntrantes;

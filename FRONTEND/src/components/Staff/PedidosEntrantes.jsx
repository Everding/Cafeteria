import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Staff/PedidosEntrantes.css';

const PedidosEntrantes = () => {
  const [comandas, setComandas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/pedidos');
        setComandas(response.data);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerPedidos();
  }, []);

  // Cambiar estado local y enviar a backend
  const cambiarEstado = async (idPedido) => {
    try {
      const pedido = comandas.find(c => c.idPedido === idPedido);
      if (!pedido || pedido.estado !== 'Pendiente') return;

      // Actualizar backend
      await axios.put(`http://localhost:3000/api/pedidos/${idPedido}`, {
        total: 0, // puede ser cualquier valor, solo necesitamos enviar el estado
        estado: 'Entregado'
      });

      // Actualizar estado local
      setComandas(prev =>
        prev.map(c =>
          c.idPedido === idPedido ? { ...c, estado: 'Entregado' } : c
        )
      );
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
    }
  };

  if (loading) return <p>Cargando pedidos...</p>;

  return (
    <div className="pedidos-container">
      <h2 className="pedidos-titulo">Pedidos Entrantes</h2>

      <div className="pedidos-lista">
        {comandas.map((comanda) => (
          <div key={comanda.idPedido} className={`comanda-card ${comanda.estado.toLowerCase()}`}>
           
            <div className="comanda-cliente">
              <img
                src={comanda.foto || "https://via.placeholder.com/48"}
                alt={comanda.usuario}
                onError={(e) => { e.target.src = "https://via.placeholder.com/48"; }}
                className="cliente-foto"
              />
              <p className="cliente-nombre">{comanda.usuario}</p>
            </div>

            <div className="comanda-separador"></div>

            <div className="comanda-detalle">
              <h3>Pedido</h3>
              <ul className="comanda-productos">
                {comanda.productos.length > 0 ? (
                  comanda.productos.map((p, index) => (
                    <li key={index}>
                      {p.cantidad}x {p.nombre}
                    </li>
                  ))
                ) : (
                  <li>No hay productos</li>
                )}
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
                onClick={() => cambiarEstado(comanda.idPedido)}
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

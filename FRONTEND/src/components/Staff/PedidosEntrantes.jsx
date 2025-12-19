import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Staff/PedidosEntrantes.css';

const PedidosEntrantes = () => {
  const [comandas, setComandas] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✔️ Fecha actual por defecto
  const hoy = new Date().toISOString().split("T")[0];
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoy);

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/pedidos');
        console.log('Pedidos recibidos:', response.data);
        setComandas(response.data);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerPedidos();
  }, []);

  const cambiarEstado = async (idPedido) => {
    try {
      const pedido = comandas.find(c => c.idPedido === idPedido);
      if (!pedido) return;

      const nuevoEstado = pedido.estado === 'Pendiente' ? 'Entregado' : 'Pendiente';

      await axios.put(`http://localhost:3000/api/pedidos/${idPedido}`, {
        total: pedido.total,
        estado: nuevoEstado
      });

      setComandas(prev =>
        prev.map(c =>
          c.idPedido === idPedido ? { ...c, estado: nuevoEstado } : c
        )
      );
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
    }
  };

  if (loading) return <p>Cargando pedidos...</p>;

  // ✔️ Filtrar por fecha
  const comandasFiltradas = comandas.filter(c => {
    if (!c.fecha_pedido) return false;
    const fechaPedido = c.fecha_pedido.split("T")[0];
    return fechaPedido === fechaSeleccionada;
  });

  return (
    <div className="pedidos-container">
      <h2 className="pedidos-titulo">Pedidos Entrantes</h2>

      {/* ✔️ Selector de fecha */}
      <div style={{ marginBottom: "15px", textAlign: "center" }}>
        <label>Filtrar por fecha: </label>
        <input
          type="date"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
        />
      </div>

      <div className="pedidos-lista">
        {comandasFiltradas.map((comanda) => {
          const nombreMostrar = comanda.usuario
            ? comanda.usuario
            : `Mesa ${comanda.id_cliente ?? '-'}`;

          return (
            <div key={comanda.idPedido} className={`comanda-card ${comanda.estado.toLowerCase()}`}>
              <div className="comanda-cliente">
                <img
                  src={comanda.foto || "https://www.google.com/url?sa=i&url=https%3A%2F%2Fmundobanco.com.ar%2Fproductos%2Fmesa-bar-cafe-cerveceria-hierro-y-madera-base-redonda%2F&psig=AOvVaw1iL2yM7exbSfcrj_sEHHxY&ust=1764737522326000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCOjazd2NnpEDFQAAAAAdAAAAABAE"}
                  alt={comanda.usuario || nombreMostrar}
                  onError={(e) => { e.target.src = "https://acdn-us.mitiendanube.com/stores/001/661/540/products/20220315_0930571-7c19dbf9523a85b46b16473541682429-1024-1024.webp"; }}
                  className="cliente-foto"
                />
                <p className="cliente-nombre">{nombreMostrar}</p>
              </div>

              <div className="comanda-separador"></div>

              <div className="comanda-detalle">
                <h3>Pedido</h3>
                <ul className="comanda-productos">
                  {comanda.productos?.length > 0 ? (
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
                <p className={`estado-texto estado-${comanda.estado?.toLowerCase() ?? 'pendiente'}`}>
                  {comanda.estado ?? 'Pendiente'}
                </p>
              </div>

              <button
                className={`boton-${comanda.estado?.toLowerCase() ?? 'pendiente'}`}
                onClick={() => cambiarEstado(comanda.idPedido)}
              >
                {comanda.estado === 'Pendiente' ? 'Marcar como Entregado' : 'Volver a Pendiente'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PedidosEntrantes;

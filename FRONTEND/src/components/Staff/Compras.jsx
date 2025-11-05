import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Staff/Compras.css";

const Compras = () => {
  const [proveedores, setProveedores] = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [compras, setCompras] = useState([]);

  const [nuevaCompra, setNuevaCompra] = useState({
    fecha: "",
    proveedorId: "",
    proveedorNuevo: "",
    total: "",
    items: [],
  });

  const [itemSeleccionado, setItemSeleccionado] = useState({ id_materia: "", cantidad: "" });

  const [paginaActual, setPaginaActual] = useState(1);
  const comprasPorPagina = 10;

  const API_COMPRAS = "http://localhost:3000/api/compras";
  const API_PROVEEDORES = "http://localhost:3000/api/proveedores";
  const API_MATERIAS = "http://localhost:3000/api/materia-prima";

  useEffect(() => {
    cargarProveedores();
    cargarMateriasPrimas();
    cargarCompras();
  }, []);

  const cargarProveedores = async () => {
    try {
      const res = await axios.get(API_PROVEEDORES);
      setProveedores(res.data);
    } catch (error) {
      console.error("Error cargando proveedores:", error);
    }
  };

  const cargarMateriasPrimas = async () => {
    try {
      const res = await axios.get(API_MATERIAS);
      setMateriasPrimas(res.data);
    } catch (error) {
      console.error("Error cargando materias primas:", error);
    }
  };

  const cargarCompras = async () => {
    try {
      const res = await axios.get(API_COMPRAS);
      setCompras(res.data);
    } catch (error) {
      console.error("Error cargando compras:", error);
    }
  };

  const handleChangeCompra = (e) => {
    setNuevaCompra({ ...nuevaCompra, [e.target.name]: e.target.value });
  };

  const handleChangeItem = (e) => {
    setItemSeleccionado({ ...itemSeleccionado, [e.target.name]: e.target.value });
  };

  const agregarItem = () => {
    if (!itemSeleccionado.id_materia || !itemSeleccionado.cantidad) return alert("Completa materia prima y cantidad");
    if (nuevaCompra.items.some(i => i.id_materia === parseInt(itemSeleccionado.id_materia))) {
      return alert("Esta materia prima ya está en la lista");
    }
    setNuevaCompra({
      ...nuevaCompra,
      items: [...nuevaCompra.items, { ...itemSeleccionado, id_materia: parseInt(itemSeleccionado.id_materia), cantidad: parseFloat(itemSeleccionado.cantidad) }]
    });
    setItemSeleccionado({ id_materia: "", cantidad: "" });
  };

  const eliminarItem = (id_materia) => {
    setNuevaCompra({
      ...nuevaCompra,
      items: nuevaCompra.items.filter(i => i.id_materia !== id_materia)
    });
  };

  const registrarCompra = async () => {
    // Verificar que todos los campos estén completos
    if (!nuevaCompra.fecha || (!nuevaCompra.proveedorId && !nuevaCompra.proveedorNuevo) || !nuevaCompra.total || nuevaCompra.items.length === 0)
      return alert("Completa todos los campos obligatorios y agrega al menos un item");

    try {
      let id_proveedor;

      // Verificar si es proveedor nuevo o existente
      if (nuevaCompra.proveedorId) {
        id_proveedor = nuevaCompra.proveedorId;
      } else if (nuevaCompra.proveedorNuevo) {
        const resProv = await axios.post(API_PROVEEDORES, { nombre: nuevaCompra.proveedorNuevo });
        id_proveedor = resProv.data.id_proveedor;
        await cargarProveedores(); // Volver a cargar los proveedores después de agregar uno nuevo
      }

      // Registrar la compra en el backend
      const compraData = {
        id_proveedor,
        fecha: nuevaCompra.fecha,
        total: parseFloat(nuevaCompra.total),
        materiasPrimas: nuevaCompra.items,
      };
      await axios.post(API_COMPRAS, compraData);

      // Actualizar el stock de las materias primas
      for (const item of nuevaCompra.items) {
        // Buscar la materia prima por su id
        const materia = materiasPrimas.find((m) => m.id_materia === item.id_materia);

        // Si no se encuentra, seguimos al siguiente item
        if (!materia) continue;

        // Realizar la actualización del stock
        await axios.put(`${API_MATERIAS}/${item.id_materia}/stock`, {
          cantidad: parseFloat(item.cantidad),
        });
      }

      // Confirmación de éxito
      alert("Compra registrada y stock actualizado correctamente");

      // Limpiar el formulario
      setNuevaCompra({ fecha: "", proveedorId: "", proveedorNuevo: "", total: "", items: [] });
      setPaginaActual(1);

      // Recargar las compras y las materias primas
      cargarCompras();
      cargarMateriasPrimas();
    } catch (error) {
      console.error("Error registrando compra:", error);
      alert("No se pudo registrar la compra");
    }
  };

  // ===============================
  // Paginación
  // ===============================
  const totalPaginas = Math.ceil(compras.length / comprasPorPagina);
  const inicio = (paginaActual - 1) * comprasPorPagina;
  const comprasPaginadas = compras.slice(inicio, inicio + comprasPorPagina);

  return (
    <div className="compras-container">
      <h2>Registro de Compras a Proveedores</h2>

      <div className="compras-form">
        <input type="date" name="fecha" value={nuevaCompra.fecha} onChange={handleChangeCompra} />

        <select
          name="proveedorId"
          value={nuevaCompra.proveedorId}
          onChange={handleChangeCompra}
        >
          <option value="">-- Seleccione proveedor existente --</option>
          {proveedores.map((p) => (
            <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>
          ))}
        </select>

        <input
          type="text"
          name="proveedorNuevo"
          placeholder="O ingrese un nuevo proveedor"
          value={nuevaCompra.proveedorNuevo}
          onChange={handleChangeCompra}
        />

        <input
          type="number"
          name="total"
          placeholder="Total ($)"
          value={nuevaCompra.total}
          onChange={handleChangeCompra}
        />

        <div className="items-compra">
          <h4>Agregar items a la compra</h4>
          <select name="id_materia" value={itemSeleccionado.id_materia} onChange={handleChangeItem}>
            <option value="">-- Seleccione materia prima --</option>
            {materiasPrimas.map((mp) => (
              <option key={mp.id_materia} value={mp.id_materia}>{mp.nombre}</option>
            ))}
          </select>
          <input
            type="number"
            name="cantidad"
            min="0"
            placeholder="Cantidad"
            value={itemSeleccionado.cantidad}
            onChange={handleChangeItem}
          />
          <button type="button" onClick={agregarItem}>Agregar Item</button>
        </div>

        <ul className="items-list">
          {nuevaCompra.items.map(i => {
            const mp = materiasPrimas.find(m => m.id_materia === i.id_materia);
            return (
              <li key={i.id_materia}>
                {mp?.nombre} - {i.cantidad} <button type="button" onClick={() => eliminarItem(i.id_materia)}>Eliminar</button>
              </li>
            );
          })}
        </ul>

        <button onClick={registrarCompra}>Registrar Compra</button>
      </div>

      <table className="compras-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Proveedor</th>
            <th>Total ($)</th>
          </tr>
        </thead>
        <tbody>
          {comprasPaginadas.map((c) => (
            <tr key={c.id_compra}>
              <td>{c.id_compra}</td>
              <td>{c.fecha_compra}</td>
              <td>{c.proveedor}</td>
              <td>{c.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="paginacionCompras">
        <button onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))} disabled={paginaActual === 1}>
          ◀ Anterior
        </button>
        <span> Página {paginaActual} de {totalPaginas} </span>
        <button onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))} disabled={paginaActual === totalPaginas}>
          Siguiente ▶
        </button>
      </div>
    </div>
  );
};

export default Compras;

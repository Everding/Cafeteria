// src/components/Staff/Compras.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Staff/Compras.css";

const API_BASE = "http://localhost:3000/api";
const API_COMPRAS = `${API_BASE}/compras`;
const API_PROVEEDORES = `${API_BASE}/proveedores`;
const API_MATERIAS = `${API_BASE}/materia-prima`;

const Compras = () => {
  const [proveedores, setProveedores] = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [compras, setCompras] = useState([]);

  const [nuevaCompra, setNuevaCompra] = useState({
    fecha: "",
    proveedorId: "",
    proveedorNuevo: "",
    total: "",
    items: []
  });

  const [itemSeleccionado, setItemSeleccionado] = useState({ id_materia: "", cantidad: "", precio_unitario: "" });

  const [paginaActual, setPaginaActual] = useState(1);
  const comprasPorPagina = 10;

  // edición
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [compraEditando, setCompraEditando] = useState(null);

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


  // Helper: sanitizeNumber

  const sanitizeNumber = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };


  // Registrar nueva compra
 
  const registrarCompra = async () => {
    if (!nuevaCompra.fecha || (!nuevaCompra.proveedorId && !nuevaCompra.proveedorNuevo) || nuevaCompra.items.length === 0) {
      return alert("Completa los campos obligatorios y agrega al menos 1 item");
    }

    try {
      let id_proveedor = nuevaCompra.proveedorId;
      if (!id_proveedor && nuevaCompra.proveedorNuevo) {
        const resProv = await axios.post(API_PROVEEDORES, { nombre: nuevaCompra.proveedorNuevo });
        id_proveedor = resProv.data.id_proveedor;
        await cargarProveedores();
      }

      const payload = {
        id_proveedor,
        fecha: nuevaCompra.fecha,
        total: sanitizeNumber(nuevaCompra.total, 0),
        materiasPrimas: nuevaCompra.items.map(it => ({
          id_materia: Number(it.id_materia),
          cantidad: sanitizeNumber(it.cantidad),
          precio_unitario: it.precio_unitario === "" || it.precio_unitario == null ? null : sanitizeNumber(it.precio_unitario)
        }))
      };

      console.log("Enviando compra:", payload);
      const res = await axios.post(API_COMPRAS, payload);
      console.log("Respuesta crear compra:", res.data);

      alert("Compra registrada correctamente");
      setNuevaCompra({ fecha: "", proveedorId: "", proveedorNuevo: "", total: "", items: [] });
      setItemSeleccionado({ id_materia: "", cantidad: "", precio_unitario: "" });
      setPaginaActual(1);
      cargarCompras();
      cargarMateriasPrimas();
    } catch (error) {
      console.error("Error registrando compra:", error);
      if (error.response) console.error("Backend:", error.response.data);
      alert("No se pudo registrar la compra. Revisa la consola.");
    }
  };


  // Items nuevo registro

  const agregarItemNuevo = () => {
    if (!itemSeleccionado.id_materia || itemSeleccionado.cantidad === "") return alert("Completa materia prima y cantidad");
    if (nuevaCompra.items.some(i => i.id_materia === Number(itemSeleccionado.id_materia))) return alert("Esta materia ya está en la lista");

    setNuevaCompra(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id_materia: Number(itemSeleccionado.id_materia),
          cantidad: sanitizeNumber(itemSeleccionado.cantidad),
          precio_unitario: itemSeleccionado.precio_unitario === "" ? null : sanitizeNumber(itemSeleccionado.precio_unitario)
        }
      ]
    }));

    setItemSeleccionado({ id_materia: "", cantidad: "", precio_unitario: "" });
  };

  const eliminarItemNuevo = (id_materia) => {
    setNuevaCompra(prev => ({ ...prev, items: prev.items.filter(i => i.id_materia !== id_materia) }));
  };


  // Editar compra (modal)

  const abrirModalEditar = async (id) => {
    try {
      const res = await axios.get(`${API_COMPRAS}/${id}`);
      const data = res.data;

      setCompraEditando({
        id_compra: data.id_compra,
        id_proveedor: data.id_proveedor,
        fecha_compra: data.fecha_compra,
        total: data.total,
        items: (data.items || []).map(it => ({
          id_item: it.id_item,
          id_materia: it.id_materia,
          cantidad: it.cantidad,
          precio_unitario: it.precio_unitario
        }))
      });
      setModalEditVisible(true);
      setItemSeleccionado({ id_materia: "", cantidad: "", precio_unitario: "" });
    } catch (error) {
      console.error("Error cargando compra:", error);
      alert("No se pudo cargar la compra para editar.");
    }
  };

  const agregarItemEdit = () => {
    if (!compraEditando) return;
    if (!itemSeleccionado.id_materia || itemSeleccionado.cantidad === "") return alert("Seleccioná materia y cantidad");
    if (compraEditando.items.some(i => i.id_materia === Number(itemSeleccionado.id_materia))) return alert("La materia ya está en la lista");

    setCompraEditando(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id_materia: Number(itemSeleccionado.id_materia),
          cantidad: sanitizeNumber(itemSeleccionado.cantidad),
          precio_unitario: itemSeleccionado.precio_unitario === "" ? null : sanitizeNumber(itemSeleccionado.precio_unitario)
        }
      ]
    }));

    setItemSeleccionado({ id_materia: "", cantidad: "", precio_unitario: "" });
  };

  const eliminarItemEdit = (id_materia) => {
    setCompraEditando(prev => ({ ...prev, items: prev.items.filter(i => i.id_materia !== id_materia) }));
  };

  const cambiarItemEdit = (idx, field, value) => {
    setCompraEditando(prev => {
      const copy = JSON.parse(JSON.stringify(prev.items)); // deep copy simple
      copy[idx][field] = (field === "id_materia") ? Number(value) : (value === "" ? "" : sanitizeNumber(value));
      return { ...prev, items: copy };
    });
  };

  const guardarCambios = async () => {
    if (!compraEditando) return;
    if (!compraEditando.id_proveedor || !compraEditando.fecha_compra) return alert("Fecha y proveedor son obligatorios");

    try {
      const payload = {
        id_proveedor: compraEditando.id_proveedor,
        fecha: compraEditando.fecha_compra,
        total: sanitizeNumber(compraEditando.total, 0),
        materiasPrimas: compraEditando.items.map(it => ({
          id_materia: Number(it.id_materia),
          cantidad: sanitizeNumber(it.cantidad),
          precio_unitario: it.precio_unitario === "" || it.precio_unitario == null ? null : sanitizeNumber(it.precio_unitario)
        }))
      };

      console.log("Enviando update:", payload);

      await axios.put(`${API_COMPRAS}/${compraEditando.id_compra}`, payload);

      alert("Compra actualizada y stock sincronizado");
      setModalEditVisible(false);
      setCompraEditando(null);
      cargarCompras();
      cargarMateriasPrimas();
    } catch (error) {
      console.error("Error actualizando compra:", error);
      if (error.response) console.error("Backend:", error.response.data);
      alert("No se pudo actualizar la compra. Revisa la consola.");
    }
  };


  // Paginación

  const totalPaginas = Math.max(1, Math.ceil(compras.length / comprasPorPagina));
  const inicio = (paginaActual - 1) * comprasPorPagina;
  const comprasPaginadas = compras.slice(inicio, inicio + comprasPorPagina);

 
  // Render

  return (
    <div className="compras-container">
      <h2>Registro de Compras a Proveedores</h2>

      <div className="compras-form">
        <input type="date" name="fecha" value={nuevaCompra.fecha} onChange={e => setNuevaCompra(prev => ({ ...prev, fecha: e.target.value }))} />

        <select name="proveedorId" value={nuevaCompra.proveedorId} onChange={e => setNuevaCompra(prev => ({ ...prev, proveedorId: e.target.value }))}>
          <option value="">-- Seleccione proveedor existente --</option>
          {proveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}
        </select>

        <input type="text" name="proveedorNuevo" placeholder="O ingrese un nuevo proveedor" value={nuevaCompra.proveedorNuevo} onChange={e => setNuevaCompra(prev => ({ ...prev, proveedorNuevo: e.target.value }))} />

        <input type="number" name="total" placeholder="Total ($)" value={nuevaCompra.total} onChange={e => setNuevaCompra(prev => ({ ...prev, total: e.target.value }))} />

        <div className="items-compra">
          <h4>Agregar items a la compra</h4>

          <select name="id_materia" value={itemSeleccionado.id_materia} onChange={e => setItemSeleccionado(prev => ({ ...prev, id_materia: e.target.value }))}>
            <option value="">-- Seleccione materia prima --</option>
            {materiasPrimas.map(mp => <option key={mp.id_materia} value={mp.id_materia}>{mp.nombre}</option>)}
          </select>

          <input type="number" name="cantidad" min="0" placeholder="Cantidad" value={itemSeleccionado.cantidad} onChange={e => setItemSeleccionado(prev => ({ ...prev, cantidad: e.target.value }))} />
          <input type="number" name="precio_unitario" placeholder="Precio unitario (opcional)" value={itemSeleccionado.precio_unitario} onChange={e => setItemSeleccionado(prev => ({ ...prev, precio_unitario: e.target.value }))} />
          <button type="button" onClick={agregarItemNuevo}>Agregar Item</button>
        </div>

        <ul className="items-list">
          {nuevaCompra.items.map(i => {
            const mp = materiasPrimas.find(m => m.id_materia === i.id_materia);
            return (
              <li key={i.id_materia}>
                {mp?.nombre || `ID:${i.id_materia}`} — {i.cantidad} — {i.precio_unitario ?? "-"}
                <button type="button" onClick={() => eliminarItemNuevo(i.id_materia)}>Eliminar</button>
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
            <th>Items</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comprasPaginadas.map(c => (
            <tr key={c.id_compra}>
              <td>{c.id_compra}</td>
              <td>{c.fecha_compra}</td>
              <td>{c.proveedor}</td>
              <td>{Number(c.total).toLocaleString()}</td>
              <td>{c.items || "Sin detalles"}</td>
              <td><button onClick={() => abrirModalEditar(c.id_compra)}>Editar</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="paginacionCompras">
        <button onClick={() => setPaginaActual(p => Math.max(p - 1, 1))} disabled={paginaActual === 1}>◀ Anterior</button>
        <span> Página {paginaActual} de {totalPaginas} </span>
        <button onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))} disabled={paginaActual === totalPaginas}>Siguiente ▶</button>
      </div>

      {modalEditVisible && compraEditando && (
        <div className="modalComprasOverlay">
          <div className="modalCompras">
            <h3>Editar Compra #{compraEditando.id_compra}</h3>

            <label>Fecha</label>
            <input type="date" value={compraEditando.fecha_compra} onChange={e => setCompraEditando(prev => ({ ...prev, fecha_compra: e.target.value }))} />

            <label>Proveedor</label>
            <select value={compraEditando.id_proveedor} onChange={e => setCompraEditando(prev => ({ ...prev, id_proveedor: e.target.value }))}>
              <option value="">-- Seleccione proveedor --</option>
              {proveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}
            </select>

            <label>Total</label>
            <input type="number" value={compraEditando.total} onChange={e => setCompraEditando(prev => ({ ...prev, total: e.target.value }))} />

            <hr />

            <h4>Items</h4>
            <div className="items-edit-add">
              <select value={itemSeleccionado.id_materia} onChange={e => setItemSeleccionado(prev => ({ ...prev, id_materia: e.target.value }))}>
                <option value="">-- Seleccione materia --</option>
                {materiasPrimas.map(mp => <option key={mp.id_materia} value={mp.id_materia}>{mp.nombre}</option>)}
              </select>

              <input type="number" placeholder="Cantidad" value={itemSeleccionado.cantidad} onChange={e => setItemSeleccionado(prev => ({ ...prev, cantidad: e.target.value }))} />
              <input type="number" placeholder="Precio unitario (opcional)" value={itemSeleccionado.precio_unitario} onChange={e => setItemSeleccionado(prev => ({ ...prev, precio_unitario: e.target.value }))} />
              <button type="button" onClick={agregarItemEdit}>Agregar</button>
            </div>

            <ul className="items-edit-list">
              {compraEditando.items.map((it, idx) => {
                const mp = materiasPrimas.find(m => m.id_materia === it.id_materia);
                return (
                  <li key={idx}>
                    <select value={it.id_materia} onChange={e => cambiarItemEdit(idx, "id_materia", e.target.value)}>
                      {materiasPrimas.map(mpOpt => <option key={mpOpt.id_materia} value={mpOpt.id_materia}>{mpOpt.nombre}</option>)}
                    </select>

                    <input type="number" value={it.cantidad} onChange={e => cambiarItemEdit(idx, "cantidad", e.target.value)} />

                    <input type="number" value={it.precio_unitario ?? ""} onChange={e => cambiarItemEdit(idx, "precio_unitario", e.target.value)} />

                    <button type="button" onClick={() => eliminarItemEdit(it.id_materia)}>Eliminar</button>
                  </li>
                );
              })}
            </ul>

            <div className="modal-actions">
              <button onClick={guardarCambios}>Guardar cambios</button>
              <button onClick={() => { setModalEditVisible(false); setCompraEditando(null); }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compras;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Staff/Stock.css";

const Stock = () => {
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [proveedores, setProveedores] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    id_materia: null,
    nombre: "",
    unidad_medida: "",
    stock_actual: "",
    stock_minimo: "",
    id_proveedor: ""
  });

  const ITEMS_POR_PAGINA = 10;
  const API_URL = "http://localhost:3000/api/materia-prima";
  const API_PROVEEDORES = "http://localhost:3000/api/proveedores";

  
  // Cargar datos iniciales
 
  useEffect(() => {
    obtenerMateriasPrimas();
    obtenerProveedores();
  }, []);

  const obtenerMateriasPrimas = async () => {
    try {
      const res = await axios.get(API_URL);
      setMateriasPrimas(res.data);
    } catch (error) {
      console.error("Error al obtener materias primas:", error);
      alert("Error al cargar materias primas.");
    }
  };

  const obtenerProveedores = async () => {
    try {
      const res = await axios.get(API_PROVEEDORES);
      setProveedores(res.data);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };

 
  // Abrir modal para agregar o editar
 
  const abrirModal = (materia = null) => {
    if (materia) {
      setFormData({
        id_materia: materia.id_materia,
        nombre: materia.nombre,
        unidad_medida: materia.unidad_medida,
        stock_actual: materia.stock_actual,
        stock_minimo: materia.stock_minimo,
        id_proveedor: materia.id_proveedor || ""
      });
    } else {
      setFormData({
        id_materia: null,
        nombre: "",
        unidad_medida: "",
        stock_actual: "",
        stock_minimo: "",
        id_proveedor: ""
      });
    }
    setModalVisible(true);
  };

  const cerrarModal = () => setModalVisible(false);

 
  // Guardar cambios (crear o editar)
 
  const guardarMateriaPrima = async () => {
    const { id_materia, nombre, unidad_medida, stock_actual, stock_minimo, id_proveedor } = formData;

    if (!nombre || !unidad_medida || !stock_actual || !stock_minimo || !id_proveedor) {
      return alert("Todos los campos son obligatorios");
    }

    try {
      if (id_materia) {
        // Editar
        await axios.put(`${API_URL}/${id_materia}`, formData);
        alert("Materia prima actualizada correctamente");
      } else {
        // Crear
        await axios.post(API_URL, formData);
        alert("Materia prima creada correctamente");
      }
      cerrarModal();
      obtenerMateriasPrimas();
    } catch (error) {
      console.error("Error al guardar materia prima:", error);
      alert("No se pudo guardar la materia prima.");
    }
  };

  // ===============================
  // Eliminar materia prima
  // ===============================
  const eliminarMateriaPrima = async (id_materia) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta materia prima?")) return;

    try {
      await axios.delete(`${API_URL}/${id_materia}`);
      alert("Materia prima eliminada correctamente");
      setMateriasPrimas((prev) => prev.filter((mp) => mp.id_materia !== id_materia));
    } catch (error) {
      console.error("Error al eliminar materia prima:", error);
      alert("No se pudo eliminar la materia prima.");
    }
  };

 
  // Filtrado y paginación
 
  const materiasFiltradas = materiasPrimas.filter((mp) =>
    mp.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(materiasFiltradas.length / ITEMS_POR_PAGINA);
  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const materiasPaginadas = materiasFiltradas.slice(inicio, inicio + ITEMS_POR_PAGINA);

  const cambiarPagina = (num) => {
    if (num < 1 || num > totalPaginas) return;
    setPaginaActual(num);
  };

 
  // Renderizado
 
  return (
    <div className="Stock-Principal">
      <div className="stock-container">
        <h2>Stock de Materias Primas</h2>

        <div className="stock-actions">
          <button onClick={() => abrirModal()}>Agregar Materia Prima</button>
        </div>

        <div className="buscador">
          <label>Buscar por nombre: </label>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            placeholder="Escribe el nombre de la materia prima..."
          />
        </div>

        <table className="stock-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Unidad</th>
              <th>Stock Actual</th>
              <th>Stock Mínimo</th>
              <th>Proveedor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materiasPaginadas.length > 0 ? (
              materiasPaginadas.map((mp) => (
                <tr key={mp.id_materia}>
                  <td>{mp.id_materia}</td>
                  <td>{mp.nombre}</td>
                  <td>{mp.unidad_medida}</td>
                  <td>{mp.stock_actual}</td>
                  <td>{mp.stock_minimo}</td>
                  <td>{mp.proveedor || "-"}</td>
                  <td className="acciones">
                    <button className="btn-actualizar" onClick={() => abrirModal(mp)}>Editar</button>
                    <button className="btn-eliminar" onClick={() => eliminarMateriaPrima(mp.id_materia)}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No se encontraron materias primas</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="paginacionStock">
          <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>
            « Anterior
          </button>
          {[...Array(totalPaginas)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => cambiarPagina(i + 1)}
              className={paginaActual === i + 1 ? "activo" : ""}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>
            Siguiente »
          </button>
        </div>
      </div>

      {/* Modal para agregar/editar */}
      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>{formData.id_materia ? "Editar Materia Prima" : "Agregar Materia Prima"}</h3>
            <label>Nombre:</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />

            <label>Unidad de medida:</label>
            <input
              type="text"
              value={formData.unidad_medida}
              onChange={(e) => setFormData({ ...formData, unidad_medida: e.target.value })}
            />

            <label>Stock actual:</label>
            <input
              type="number"
              value={formData.stock_actual}
              onChange={(e) => setFormData({ ...formData, stock_actual: e.target.value })}
            />

            <label>Stock mínimo:</label>
            <input
              type="number"
              value={formData.stock_minimo}
              onChange={(e) => setFormData({ ...formData, stock_minimo: e.target.value })}
            />

            <label>Proveedor:</label>
            <select
              value={formData.id_proveedor}
              onChange={(e) => setFormData({ ...formData, id_proveedor: e.target.value })}
            >
              <option value="">Selecciona un proveedor</option>
              {proveedores.map((p) => (
                <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>
              ))}
            </select>

            <div className="modal-buttons">
              <button onClick={guardarMateriaPrima}>Guardar</button>
              <button onClick={cerrarModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;

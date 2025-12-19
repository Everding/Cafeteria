import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Staff/AdministrarEmpleados.css";

const API_URL = "http://localhost:3000/api/personal";

const AdministrarEmpleado = () => {
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    correo: "",
    contrasena: "",
    idRol: "",
    imagen: null,
  });
  const [editingId, setEditingId] = useState(null);

  // ==========================
  // Cargar empleados al montar
  // ==========================
  useEffect(() => {
    obtenerEmpleados();
  }, []);

  const obtenerEmpleados = async () => {
    try {
      const res = await axios.get(API_URL);
      setEmpleados(res.data);
    } catch (err) {
      console.error("Error al obtener empleados:", err);
    }
  };

  // ==========================
  // Manejar inputs
  // ==========================
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ==========================
  // Crear o actualizar empleado
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        // Evita enviar contraseña vacía en actualizaciones
        if (editingId && key === "contrasena" && value === "") return;
        if (value !== null && value !== "") data.append(key, value);
      });

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Empleado actualizado correctamente");
      } else {
        await axios.post(API_URL, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Empleado agregado correctamente");
      }

      // Reset form
      setFormData({
        nombre: "",
        apellido: "",
        dni: "",
        correo: "",
        contraseña: "",
        idRol: "",
        imagen: null,
      });
      setEditingId(null);
      obtenerEmpleados();
    } catch (err) {
      console.error("Error al guardar empleado:", err);
      alert("Error al guardar empleado");
    }
  };

  // ==========================
  // Editar empleado
  // ==========================
  const handleEdit = (empleado) => {
    setEditingId(empleado.idPersonal);
    setFormData({
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      dni: empleado.dni,
      correo: empleado.correo,
      contraseña: "",
      idRol: empleado.idRol,
      imagen: null,
    });
  };

  // ==========================
  // Eliminar empleado
  // ==========================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este empleado?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      obtenerEmpleados();
      alert("Empleado eliminado correctamente");
    } catch (err) {
      console.error("Error al eliminar empleado:", err);
    }
  };

  // ==========================
  // Filtrar por rol
  // ==========================
  const encargados = empleados.filter((e) => e.idRol === 2);
  const empleadosComunes = empleados.filter((e) => e.idRol === 3);

  // ==========================
  // Render
  // ==========================
  return (
    <div className="asignacion-wrapper">
    <aside className="sidebar">
      <h3>Panel</h3>
      <button
        className="btn-admin"
        onClick={() => (window.location.href = "/Empleados")}
      >
        Horario de Empleados
      </button>
    </aside>

    <div className="empleados-page">
      <h1>Administrar Personal</h1>

      <form className="empleados-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="dni"
          placeholder="DNI"
          value={formData.dni}
          onChange={handleChange}
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={formData.correo}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          value={formData.contrasena}
          onChange={handleChange}
          required={!editingId}
        />
        <input
          type="number"
          name="idRol"
          placeholder="ID Rol (1 = Encargado, 2 = Empleado)"
          value={formData.idRol}
          onChange={handleChange}
          required
        />
        <input type="file" name="imagen" accept="image/*" onChange={handleChange} />

        <button type="submit">{editingId ? "Actualizar" : "Agregar"}</button>
      </form>

      {/* ========================== */}
      {/* Sección: Encargados */}
      {/* ========================== */}
      <h2>Encargados</h2>
      <div className="empleados-list">
        {encargados.length > 0 ? (
          encargados.map((emp) => (
            <div key={emp.idPersonal} className="empleado-card encargado-card">
              <img
                src={emp.imagen_url || "https://i.pravatar.cc/150?img=3"}
                alt={emp.nombre}
                className="empleado-img"
              />
              <h3>
                {emp.nombre} {emp.apellido}
              </h3>
              <p>{emp.correo}</p>
              <p>DNI: {emp.dni}</p>
              <p>Rol: Encargado</p>
              <div className="empleado-buttons">
                <button onClick={() => handleEdit(emp)}>Editar</button>
                <button onClick={() => handleDelete(emp.idPersonal)}>Eliminar</button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay encargados registrados.</p>
        )}
      </div>

      {/* ========================== */}
      {/* Sección: Empleados */}
      {/* ========================== */}
      <h2>Empleados</h2>
      <div className="empleados-list">
        {empleadosComunes.length > 0 ? (
          empleadosComunes.map((emp) => (
            <div key={emp.idPersonal} className="empleado-card empleado-card">
              <img
                src={emp.imagen_url || "https://i.pravatar.cc/150?img=3"}
                alt={emp.nombre}
                className="empleado-img"
              />
              <h3>
                {emp.nombre} {emp.apellido}
              </h3>
              <p>{emp.correo}</p>
              <p>DNI: {emp.dni}</p>
              <p>Rol: Empleado</p>
              <div className="empleado-buttons">
                <button onClick={() => handleEdit(emp)}>Editar</button>
                <button onClick={() => handleDelete(emp.idPersonal)}>Eliminar</button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay empleados registrados.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default AdministrarEmpleado;

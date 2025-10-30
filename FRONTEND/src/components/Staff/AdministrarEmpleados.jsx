import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Staff/AdministrarEmpleados.css";

const AdministrarEmpleados = ({ onUpdateEmpleados }) => {
  const navigate = useNavigate();

  const [empleados, setEmpleados] = useState([]);
  const [encargados, setEncargados] = useState([]);

  // ---------- FUNCIONES GENERALES ----------
  const handleEdit = (id, tipo) => {
    const lista = tipo === "empleado" ? empleados : encargados;
    const setLista = tipo === "empleado" ? setEmpleados : setEncargados;
    setLista(
      lista.map((e) => (e.idPersonal === id ? { ...e, editando: true, cambios: {} } : e))
    );
  };

  const handleChange = (id, tipo, campo, valor) => {
    const lista = tipo === "empleado" ? empleados : encargados;
    const setLista = tipo === "empleado" ? setEmpleados : setEncargados;
    setLista(
      lista.map((e) =>
        e.idPersonal === id ? { ...e, cambios: { ...e.cambios, [campo]: valor } } : e
      )
    );
  };

  const handleSave = (id, tipo) => {
    const lista = tipo === "empleado" ? empleados : encargados;
    const setLista = tipo === "empleado" ? setEmpleados : setEncargados;

    setLista(
      lista.map((e) =>
        e.idPersonal === id
          ? { ...e, ...e.cambios, editando: false, cambios: {} }
          : e
      )
    );

    if (onUpdateEmpleados) onUpdateEmpleados([...empleados, ...encargados]);
  };

  const handleCancel = (id, tipo) => {
    const lista = tipo === "empleado" ? empleados : encargados;
    const setLista = tipo === "empleado" ? setEmpleados : setEncargados;
    setLista(
      lista.map((e) =>
        e.idPersonal === id ? { ...e, editando: false, cambios: {} } : e
      )
    );
  };

  const handleDelete = (id, tipo) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar este empleado?"
    );
    if (!confirmacion) return;
    if (tipo === "empleado") {
      setEmpleados(empleados.filter((e) => e.idPersonal !== id));
    } else {
      setEncargados(encargados.filter((e) => e.idPersonal !== id));
    }
  };

  const agregarEmpleado = (tipo) => {
    const lista = tipo === "empleado" ? empleados : encargados;
    const setLista = tipo === "empleado" ? setEmpleados : setEncargados;

    const nuevo = {
      idPersonal: Date.now(),
      nombre: "",
      apellido: "",
      dni: "",
      correo: "",
      contraseña: "",
      idRol: tipo === "empleado" ? 2 : 3,
      imagen: "https://i.pravatar.cc/100",
      editando: true,
      cambios: {},
    };

    setLista([nuevo, ...lista]);
  };

  // ---------- RENDERIZAR FILA ----------
  const renderFila = (e, tipo) => (
    <div className="admin-card" key={e.idPersonal}>
      <img src={e.cambios?.imagen ?? e.imagen} alt={e.nombre} className="admin-foto" />
      <div className="admin-info">
        {e.editando ? (
          <>
            <input
              type="text"
              placeholder="Nombre"
              value={e.cambios.nombre ?? e.nombre}
              onChange={(ev) => handleChange(e.idPersonal, tipo, "nombre", ev.target.value)}
            />
            <input
              type="text"
              placeholder="Apellido"
              value={e.cambios.apellido ?? e.apellido}
              onChange={(ev) => handleChange(e.idPersonal, tipo, "apellido", ev.target.value)}
            />
            <input
              type="text"
              placeholder="DNI"
              value={e.cambios.dni ?? e.dni}
              onChange={(ev) => handleChange(e.idPersonal, tipo, "dni", ev.target.value)}
            />
            <input
              type="email"
              placeholder="Correo"
              value={e.cambios.correo ?? e.correo}
              onChange={(ev) => handleChange(e.idPersonal, tipo, "correo", ev.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={e.cambios.contraseña ?? e.contraseña}
              onChange={(ev) => handleChange(e.idPersonal, tipo, "contraseña", ev.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(ev) => {
                const file = ev.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => handleChange(e.idPersonal, tipo, "imagen", reader.result);
                reader.readAsDataURL(file);
              }}
            />
          </>
        ) : (
          <>
            <h4>{e.nombre} {e.apellido}</h4>
            <p><strong>DNI:</strong> {e.dni}</p>
            <p><strong>Correo:</strong> {e.correo}</p>
          </>
        )}
      </div>
      <div className="admin-buttons">
        {!e.editando && <button onClick={() => handleEdit(e.idPersonal, tipo)} className="btn-editar">Editar</button>}
        {e.editando && (
          <>
            <button onClick={() => handleSave(e.idPersonal, tipo)} className="btn-guardar">Guardar</button>
            <button onClick={() => handleCancel(e.idPersonal, tipo)} className="btn-cancelar">Cancelar</button>
          </>
        )}
        <button onClick={() => handleDelete(e.idPersonal, tipo)} className="btn-eliminar">Eliminar</button>
      </div>
    </div>
  );

  // ---------- RENDER PRINCIPAL ----------
  return (
    
    <div className="admin-empleados-container">
      <h2>Administración de Personal</h2>

          <div style={{ marginTop: "30px" }}>
        <button className="btn-volver" onClick={() => navigate("/Empleados")}>
          Volver a la Gestión
        </button>
      </div>

      <div className="admin-columns">
        <div className="admin-column">
          <h3>Encargados</h3>
          <button className="btn-agregar" onClick={() => agregarEmpleado("encargado")}>
            Agregar Encargado
          </button>
          {encargados.map((e) => renderFila(e, "encargado"))}
        </div>

        <div className="admin-column">
          <h3>Empleados</h3>
          <button className="btn-agregar" onClick={() => agregarEmpleado("empleado")}>
            Agregar Empleado
          </button>
          {empleados.map((e) => renderFila(e, "empleado"))}
        </div>
      </div>
    </div>
  );
};

export default AdministrarEmpleados;

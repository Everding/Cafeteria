import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Staff/Empleados.css";

const API_URL = "http://localhost:3000/api/asignacion-semanal";

const Empleados = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({});
  const [empleadosSinAsignar, setEmpleadosSinAsignar] = useState([]);
  const [asignando, setAsignando] = useState(null);

  // ===============================
  // CARGAR DATOS
  // ===============================
  useEffect(() => {
    obtenerAsignaciones();
    obtenerSucursales();
    obtenerTurnos();
    obtenerEmpleadosSinAsignar();
  }, []);

  const obtenerAsignaciones = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setAsignaciones(data);
    } catch (error) {
      console.error("Error al obtener asignaciones:", error);
    }
  };

  const obtenerSucursales = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/sucursales");
      setSucursales(data);
    } catch (error) {
      console.error("Error al obtener sucursales:", error);
    }
  };


  const guardarNuevaAsignacion = async (idPersonal) => {
  try {
    if (!formData.idSucursal || !formData.idTurno) {
      alert("⚠️ Debes seleccionar sucursal y turno");
      return;
    }

    // Calculamos automáticamente las fechas (semana actual)
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0 = domingo
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - diaSemana + 1);
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);

    const fechaInicioSemana = lunes.toISOString().split("T")[0];
    const fechaFinSemana = domingo.toISOString().split("T")[0];

    await axios.post(`${API_URL}`, {
      idPersonal,
      idSucursal: formData.idSucursal,
      idTurno: formData.idTurno,
      fechaInicioSemana,
      fechaFinSemana,
    });

    alert("✅ Empleado asignado correctamente");
    setAsignando(null);
    setFormData({});
    obtenerAsignaciones();
    obtenerEmpleadosSinAsignar();
  } catch (error) {
    console.error("Error al crear asignación:", error);
    alert("❌ Error al asignar empleado");
  }
};


  const obtenerTurnos = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/turnos");
      setTurnos(data);
    } catch (error) {
      console.error("Error al obtener turnos:", error);
    }
  };

  const obtenerEmpleadosSinAsignar = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/sin-asignar`);
      setEmpleadosSinAsignar(data);
    } catch (error) {
      console.error("Error al obtener empleados sin asignar:", error);
    }
  };

  // ===============================
  // EDITAR ASIGNACIÓN
  // ===============================
  const iniciarEdicion = (asignacion) => {
    setEditando(asignacion.idAsignacion);
    setFormData({
      idSucursal: asignacion.idSucursal,
      idTurno: asignacion.idTurno,
    });
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const guardarCambios = async (idAsignacion) => {
    try {
      const asignacion = asignaciones.find(
        (a) => a.idAsignacion === idAsignacion
      );

      await axios.put(`${API_URL}/${idAsignacion}`, {
        idPersonal: asignacion.idPersonal,
        idSucursal: formData.idSucursal,
        idTurno: formData.idTurno,
        fechaInicioSemana: asignacion.fechaInicioSemana,
        fechaFinSemana: asignacion.fechaFinSemana,
      });

      alert("✅ Asignación actualizada correctamente");
      setEditando(null);
      obtenerAsignaciones();
    } catch (error) {
      console.error("Error al actualizar asignación:", error);
      alert("❌ Error al actualizar la asignación");
    }
  };

  // ===============================
  // AGRUPAR POR SUCURSAL
  // ===============================
 const empleadosPorSucursal = sucursales.map((sucursal) => {
  const empleados = asignaciones.filter(
    (a) => a.idSucursal === sucursal.idSucursal
  );

  // Separar por turno
  const mañana = empleados.filter((e) => e.idTurno === 1);
  const tarde = empleados.filter((e) => e.idTurno === 2);

  return {
    ...sucursal,
    mañana,
    tarde,
  };
});

  return (
  <div className="asignacion-wrapper">
    <aside className="sidebar">
      <h3>Panel</h3>
      <button
        className="btn-admin"
        onClick={() => (window.location.href = "/AdministrarEmpleados")}
      >
        Administrar empleados
      </button>
    </aside>
    <div className="asignacion-container">
      <h2>Asignación Semanal de Empleados</h2>

      {/* ========================= */}
      {/* Empleados sin asignar */}
      {/* ========================= */}
      {empleadosSinAsignar.length > 0 && (
        <div className="sucursal-card sin-asignar">
          <h3>Empleados sin asignar</h3>
          <div className="empleados-grid">
            {empleadosSinAsignar.map((emp) => (
              <div key={emp.idPersonal} className="empleado-card">
                <img
                  src={emp.imagen_url}
                  alt={emp.nombre}
                  className="empleado-foto"
                />
                <div className="empleado-info">
                  <h4>
                    {emp.nombre} {emp.apellido}
                  </h4>
                  <p>
                    <strong>DNI:</strong> {emp.dni}
                  </p>
                  <p>
                    <strong>Rol:</strong>{" "}
                    {emp.idRol === 2 ? "Encargado" : emp.idRol === 3 ? "Empleado" : "Desconocido"}
                  </p>
                </div>
                <div className="accionesEmpleadosCard">
                  <button
                    className="btn-editarEmpleadosCard"
                    onClick={() => setAsignando(emp.idPersonal)}
                  >
                    Asignar
                  </button>
                  {asignando === emp.idPersonal && (
                    <div className="form-asignar">
                      <label>
                        <strong>Sucursal:</strong>
                        <select
                          name="idSucursal"
                          value={formData.idSucursal || ""}
                          onChange={handleChange}
                        >
                          <option value="">Seleccionar</option>
                          {sucursales.map((s) => (
                            <option key={s.idSucursal} value={s.idSucursal}>
                              {s.nombreSucursal}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        <strong>Turno:</strong>
                        <select
                          name="idTurno"
                          value={formData.idTurno || ""}
                          onChange={handleChange}
                        >
                          <option value="">Seleccionar</option>
                          {turnos.map((t) => (
                            <option key={t.idTurno} value={t.idTurno}>
                              {t.nombreTurno} ({t.horaEntrada} - {t.horaSalida})
                            </option>
                          ))}
                        </select>
                      </label>

                      <button
                        className="btn-guardarEmpleadosCard"
                        onClick={() => guardarNuevaAsignacion(emp.idPersonal)}
                      >
                        Guardar Asignación
                      </button>

                      <button className="btn-cancelarEmpleadosCard" onClick={() => setAsignando(null)}>
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* Empleados por sucursal */}
      {/* ========================= */}
<div className="sucursales-grid">
  {empleadosPorSucursal.map((sucursal) => (
    <div key={sucursal.idSucursal} className="sucursal-card">
      <h3>{sucursal.nombreSucursal}</h3>
      <p className="direccion">{sucursal.direccion}</p>

      {/* MAÑANA */}
      <div className="turno-section">
        <h4 className="turno-titulo">Mañana (07:00 - 14:00)</h4>
        {sucursal.mañana.length > 0 ? (
          <div className="empleados-grid">
            {sucursal.mañana.map((emp) => (
              <EmpleadoCard
                key={emp.idAsignacion}
                emp={emp}
                editando={editando}
                formData={formData}
                handleChange={handleChange}
                iniciarEdicion={iniciarEdicion}
                guardarCambios={guardarCambios}
                cancelarEdicion={cancelarEdicion}
                turnos={turnos}
                sucursales={sucursales}
              />
            ))}
          </div>
        ) : (
          <p className="sin-empleados">Sin empleados asignados</p>
        )}
      </div>

      {/* TARDE */}
      <div className="turno-section">
        <h4 className="turno-titulo">Tarde (16:00 - 23:00)</h4>
        {sucursal.tarde.length > 0 ? (
          <div className="empleados-grid">
            {sucursal.tarde.map((emp) => (
              <EmpleadoCard
                key={emp.idAsignacion}
                emp={emp}
                editando={editando}
                formData={formData}
                handleChange={handleChange}
                iniciarEdicion={iniciarEdicion}
                guardarCambios={guardarCambios}
                cancelarEdicion={cancelarEdicion}
                turnos={turnos}
                sucursales={sucursales}
              />
            ))}
          </div>
        ) : (
          <p className="sin-empleados">Sin empleados asignados</p>
        )}
      </div>
    </div>
  ))}
</div>
    </div>
    </div>
  );
};

const EmpleadoCard = ({
  emp,
  editando,
  formData,
  handleChange,
  iniciarEdicion,
  guardarCambios,
  cancelarEdicion,
  turnos,
  sucursales,
}) => (
  <div className="empleado-card">
    <img
      src={emp.imagen_url || "/default-avatar.png"}
      alt={emp.personal}
      className="empleado-foto"
      onError={(e) => {
        e.target.src = "/default-avatar.png";
      }}
    />
    <div className="empleado-info">
      <h4>{emp.personal}</h4>
      <p>
        <strong>DNI:</strong> {emp.dni}
      </p>
      <p>
        <strong>Turno:</strong>{" "}
        {editando === emp.idAsignacion ? (
          <select name="idTurno" value={formData.idTurno} onChange={handleChange}>
            {turnos.map((t) => (
              <option key={t.idTurno} value={t.idTurno}>
                {t.nombreTurno} ({t.horaEntrada} - {t.horaSalida})
              </option>
            ))}
          </select>
        ) : (
          `${emp.turno} (${emp.horaEntrada} - ${emp.horaSalida})`
        )}
      </p>
      <p>
        <strong>Rol:</strong>{" "}
        {emp.idRol === 1 ? "Encargado" : emp.idRol === 2 ? "Empleado" : "Desconocido"}
      </p>

      {editando === emp.idAsignacion && (
        <div>
          <label>
            <strong>Sucursal:</strong>{" "}
            <select name="idSucursal" value={formData.idSucursal} onChange={handleChange}>
              {sucursales.map((s) => (
                <option key={s.idSucursal} value={s.idSucursal}>
                  {s.nombreSucursal}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>

    <div className="accionesEmpleadosCard">
      {editando === emp.idAsignacion ? (
        <>
          <button className="btn-guardarEmpleadosCard" onClick={() => guardarCambios(emp.idAsignacion)}>
            Guardar
          </button>
          <button className="btn-cancelarEmpleadosCard" onClick={cancelarEdicion}>
            Cancelar
          </button>
        </>
      ) : (
        <button className="btn-editarEmpleadosCard" onClick={() => iniciarEdicion(emp)}>
          Editar
        </button>
      )}
    </div>
  </div>
);

export default Empleados;

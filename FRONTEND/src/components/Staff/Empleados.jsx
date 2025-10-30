import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Staff/Empleados.css';

const Empleados = () => {
  const navigate = useNavigate();

  const [sucursales, setSucursales] = useState([]);
  const [cambiosPendientes, setCambiosPendientes] = useState([]);

  // ---------- TRAER EMPLEADOS DESDE LA DB ----------
  useEffect(() => {
    // Simulación de fetch a backend
    const fetchEmpleados = async () => {
      // Ejemplo de datos que vendrían de la DB
      const data = [
        {
          idPersonal: 1,
          nombre: 'Ana',
          rol: 'Encargado',
          sucursalId: 1,
          horarioId: 1,
        },
        {
          idPersonal: 2,
          nombre: 'Carlos',
          rol: 'Encargado',
          sucursalId: 1,
          horarioId: 1,
        },
        {
          idPersonal: 3,
          nombre: 'Marta',
          rol: 'Empleado',
          sucursalId: 1,
          horarioId: 1,
        },
        {
          idPersonal: 4,
          nombre: 'Lucía',
          rol: 'Encargado',
          sucursalId: 1,
          horarioId: 2,
        },
        {
          idPersonal: 5,
          nombre: 'Pedro',
          rol: 'Empleado',
          sucursalId: 1,
          horarioId: 2,
        },
      ];

      // Estructura de sucursales y horarios
      const sucursalesDB = [
        { id: 1, nombre: 'Sucursal 1', horarios: [
          { id: 1, rango: '07:00 AM - 14:00 PM', empleados: [] },
          { id: 2, rango: '16:00 PM - 23:00 PM', empleados: [] },
        ]},
        { id: 2, nombre: 'Sucursal 2', horarios: [
          { id: 3, rango: '07:00 AM - 14:00 PM', empleados: [] },
          { id: 4, rango: '16:00 PM - 23:00 PM', empleados: [] },
        ]},
      ];

      // Asignar empleados a sus sucursales y horarios
      data.forEach(emp => {
        const suc = sucursalesDB.find(s => s.id === emp.sucursalId);
        if (!suc) return;
        const hor = suc.horarios.find(h => h.id === emp.horarioId);
        if (!hor) return;
        hor.empleados.push({ nombre: emp.nombre, cargo: emp.rol });
      });

      setSucursales(sucursalesDB);
    };

    fetchEmpleados();
  }, []);

  // ---------- FUNCIONES PARA MOVER EMPLEADOS ----------
  const moverEmpleado = (empleado, sucursalIdActual, horarioIdActual, destino) => {
    const cambio = {
      empleado: empleado.nombre,
      deSucursal: sucursalIdActual,
      deHorario: horarioIdActual,
      aSucursal: destino.sucursalId,
      aHorario: destino.horarioId,
    };
    setCambiosPendientes([...cambiosPendientes, cambio]);

    const nuevasSucursales = sucursales.map((sucursal) => {
      if (sucursal.id === sucursalIdActual) {
        sucursal.horarios = sucursal.horarios.map((horario) => {
          if (horario.id === horarioIdActual) {
            horario.empleados = horario.empleados.filter(e => e.nombre !== empleado.nombre);
          }
          return horario;
        });
      }

      if (sucursal.id === destino.sucursalId) {
        sucursal.horarios = sucursal.horarios.map((horario) => {
          if (horario.id === destino.horarioId) {
            horario.empleados.push(empleado);
          }
          return horario;
        });
      }

      return sucursal;
    });

    setSucursales(nuevasSucursales);
  };

  const handleGuardarCambios = () => {
    if (cambiosPendientes.length === 0) return;

    let mensaje = "Se aplicarán los siguientes cambios:\n\n";
    cambiosPendientes.forEach((c, i) => {
      mensaje += `${i + 1}. ${c.empleado}: de Sucursal ${c.deSucursal}, Horario ${c.deHorario} → Sucursal ${c.aSucursal}, Horario ${c.aHorario}\n`;
    });

    if (window.confirm(mensaje)) {
      setCambiosPendientes([]);
      // Aquí se podría hacer un fetch POST/PUT al backend para guardar los cambios
    }
  };

  const handleCancelarCambios = () => {
    if (cambiosPendientes.length === 0) return;

    let restaurarSucursales = JSON.parse(JSON.stringify(sucursales));

    cambiosPendientes.slice().reverse().forEach((c) => {
      const destSucursal = restaurarSucursales.find(s => s.id === c.aSucursal);
      const destHorario = destSucursal.horarios.find(h => h.id === c.aHorario);
      const empleadoObj = destHorario.empleados.find(e => e.nombre === c.empleado);
      destHorario.empleados = destHorario.empleados.filter(e => e.nombre !== c.empleado);

      const origSucursal = restaurarSucursales.find(s => s.id === c.deSucursal);
      const origHorario = origSucursal.horarios.find(h => h.id === c.deHorario);
      origHorario.empleados.push(empleadoObj);
    });

    setSucursales(restaurarSucursales);
    setCambiosPendientes([]);
  };

  return (
    <div className="empleados-layout">
      <aside className="empleados-aside">
        <h3>Opciones</h3>
        <button
          className="ver-todos-btn"
          onClick={() => navigate('/AdministrarEmpleados')}
        >
          Ver a todos los empleados
        </button>
      </aside>

      <main className="empleados-container">
        <h2 className="empleados-titulo">Gestión de Empleados</h2>

        {cambiosPendientes.length > 0 && (
          <div className="botones-cambios">
            <button onClick={handleGuardarCambios} className="btn-guardar">
              Guardar Cambios
            </button>
            <button onClick={handleCancelarCambios} className="btn-cancelar">
              Cancelar
            </button>
          </div>
        )}

        <div className="sucursales-grid">
          {sucursales.map((sucursal) => (
            <div key={sucursal.id} className="sucursal-card">
              <h3 className="sucursal-nombre">{sucursal.nombre}</h3>

              {sucursal.horarios.map((horario) => (
                <div key={horario.id} className="horario-card">
                  <h4 className="horario-rango">{horario.rango}</h4>

                  <div className="empleados-lista">
                    {horario.empleados.length > 0 ? (
                      horario.empleados.map((empleado, i) => (
                        <div key={i} className="empleado-item">
                          <div className="empleado-info">
                            <span className="empleado-nombre">{empleado.nombre}</span>
                            <span className="empleado-cargo">({empleado.cargo})</span>
                          </div>

                          <select
                            className="mover-select"
                            onChange={(e) => {
                              const [sucursalId, horarioId] = e.target.value
                                .split('-')
                                .map(Number);
                              moverEmpleado(empleado, sucursal.id, horario.id, {
                                sucursalId,
                                horarioId,
                              });
                              e.target.value = '';
                            }}
                          >
                            <option value="">Mover a...</option>
                            {sucursales.map((dest) =>
                              dest.horarios.map((h) => (
                                <option
                                  key={`${dest.id}-${h.id}`}
                                  value={`${dest.id}-${h.id}`}
                                  disabled={dest.id === sucursal.id && h.id === horario.id}
                                >
                                  {dest.nombre} - {h.rango}
                                </option>
                              ))
                            )}
                          </select>
                        </div>
                      ))
                    ) : (
                      <p className="sin-empleados">Sin empleados asignados</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Empleados;

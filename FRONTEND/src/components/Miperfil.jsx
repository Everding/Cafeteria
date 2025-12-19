import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MiPerfil.css";
import { useAuth } from "../context/AuthContext.jsx";

const MiPerfil = () => {
  const { token, setUser } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [previewImagen, setPreviewImagen] = useState("");
  const [loading, setLoading] = useState(true);


  // Cargar perfil
useEffect(() => {
  const cargarPerfil = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Actualiza el estado local
      setUsuario({
        ...res.data.perfil,
        tipo: res.data.tipo,
        compras: res.data.compras || [],
        horarios: res.data.horarios || [],
      });
      setPreviewImagen(res.data.perfil.imagen_url);

      // Actualiza el contexto global para Header
     setUser({
  ...res.data.perfil,
  tipo: res.data.tipo,
});
localStorage.setItem("usuario", JSON.stringify({
  ...res.data.perfil,
  tipo: res.data.tipo,
}));
    } catch (error) {
      console.error("Error al obtener perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  if (token) cargarPerfil();
}, [token]);



  //  Cambiar imagen
const handleImagenChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("imagen", file);

  try {
    const res = await axios.put("http://localhost:3000/api/perfil/imagen", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    // Actualiza el perfil local
    setPreviewImagen(res.data.imagen_url);
    setUsuario({ ...usuario, imagen_url: res.data.imagen_url });

    //  Actualiza el usuario global para reflejarlo en el Header
    setUser((prev) => {
  const actualizado = { ...prev, imagen_url: res.data.imagen_url };
  localStorage.setItem("usuario", JSON.stringify(actualizado));
  return actualizado;
});

    alert("Imagen actualizada correctamente ✅");
  } catch (error) {
    console.error("Error al subir imagen:", error);
    alert("Error al actualizar imagen ❌");
  }
};


  //  Editar campo
  const handleChange = (campo, valor) => {
    setUsuario({ ...usuario, [campo]: valor });
  };

  //  Guardar cambios
  const guardarCambios = async () => {
    try {
      await axios.put(
        "http://localhost:3000/api/perfil",
        {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          correo: usuario.correo,
          telefono: usuario.telefono,
          direccion: usuario.direccion,
          usuario: usuario.usuario,
          dni: usuario.dni,
          contraseña: usuario.contraseña,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Perfil actualizado correctamente");
      setEditando(false);
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      alert("Error al guardar los cambios");
    }
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (!usuario) return <p>No se encontró el perfil</p>;

  // Campos distintos según tipo
  const campos =
    usuario.tipo === "personal"
      ? [
          { label: "Nombre", key: "nombre" },
          { label: "Apellido", key: "apellido" },
          { label: "DNI", key: "dni" },
          { label: "Contraseña", key: "contraseña" },
        ]
      : [
          { label: "Nombre", key: "nombre" },
          { label: "Apellido", key: "apellido" },
          { label: "Correo", key: "correo" },
          { label: "Teléfono", key: "telefono" },
          { label: "Dirección", key: "direccion" },
          { label: "Usuario", key: "usuario" },
        ];

  //  Mostrar rol si es personal
  const obtenerRolPersonal = () => {
    if (usuario.tipo !== "personal") return `@${usuario.usuario || "Sin nombre"}`;
    switch (usuario.idPersonal) {
      case 1:
        return "Administrador";
      case 2:
        return "Encargado";
      case 3:
        return "Empleado";
      default:
        return "Personal";
    }
  };

  return (
    <div className="miperfil-container">
      {/*  HEADER  */}
      <div className="miperfil-header">
        <div className="foto-container">
          <img src={previewImagen} alt="Perfil" className="perfil-foto" />
          {editando && (
            <label className="cambiar-foto">
              Cambiar
              <input type="file" onChange={handleImagenChange} style={{ display: "none" }} />
            </label>
          )}
        </div>
        <div className="tipo-usuario">{obtenerRolPersonal()}</div>
      </div>

      {/*  DATOS  */}
      <div className="datos-container">
        <h3>Mis Datos</h3>
        {campos.map(({ label, key }) => (
          <div key={key} className="datos-item">
            <label>{label}:</label>
            {editando ? (
              <input
                type={key === "contraseña" ? "password" : "text"}
                value={usuario[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            ) : (
              <span>{usuario[key] || "—"}</span>
            )}
          </div>
        ))}

        <div className="botones-editar">
          {editando ? (
            <>
              <button onClick={guardarCambios}>Guardar</button>
              <button onClick={() => setEditando(false)}>Cancelar</button>
            </>
          ) : (
            <button onClick={() => setEditando(true)}>Editar Datos</button>
          )}
        </div>
      </div>

      {/*  COMPRAS (solo usuariosapp)  */}
      {usuario.tipo === "usuariosapp" && (
        <div className="mis-horarios">
          <h3>Mis Compras</h3>
          {usuario.compras.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {usuario.compras.map((c) => (
                  <tr key={c.idVenta}>
                    <td>{new Date(c.fecha_venta).toLocaleDateString()}</td>
                    <td>${c.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay compras registradas</p>
          )}
        </div>
      )}

      {/*  HORARIOS (solo personal)  */}
      {usuario.tipo === "personal" && (
        <div className="mis-horarios">
          <h3>Mis Horarios</h3>
          {usuario.horarios.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Sucursal</th>
                  <th>Turno</th>
                </tr>
              </thead>
              <tbody>
                {usuario.horarios.map((h) => (
                  <tr key={h.idAsignacion}>
                    <td>
                      {h.idSucursal === 1
                        ? "Central"
                        : h.idSucursal === 2
                        ? "Secundaria"
                        : `Sucursal ${h.idSucursal}`}
                    </td>
                    <td>
                      {h.idTurno === 1
                        ? "07:00 AM a 14:00 PM"
                        : h.idTurno === 2
                        ? "16:00 PM a 23:00 PM"
                        : `Turno ${h.idTurno}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay horarios asignados</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MiPerfil;

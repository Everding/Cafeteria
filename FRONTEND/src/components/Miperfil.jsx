import React, { useState } from "react";
import "../styles/MiPerfil.css";

const MiPerfil = () => {
  // Ejemplo de usuario local
  const [usuario, setUsuario] = useState({
    tipo: "usuariosapp", // "personal" o "usuariosapp"
    nombre: "Lucía",
    apellido: "Torres",
    correo: "lucia@example.com",
    telefono: "123456789",
    direccion: "Calle Falsa 123",
    usuario: "luciaT",
    imagen: "https://i.pravatar.cc/150?img=5",
    compras: [
      { id: 1, fecha: "2025-10-28", productos: "Café con leche, Medialuna", total: 1800 },
      { id: 2, fecha: "2025-10-27", productos: "Capuchino", total: 900 },
    ],
    horarios: [
      { sucursal: "Cafetería Central", rango: "07:00 - 14:00" },
      { sucursal: "Cafetería Norte", rango: "16:00 - 23:00" },
    ],
  });

  const [editando, setEditando] = useState(false);
  const [previewImagen, setPreviewImagen] = useState(usuario.imagen);

  const handleChange = (campo, valor) => {
    setUsuario({ ...usuario, [campo]: valor });
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagen(reader.result);
        setUsuario({ ...usuario, imagen: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="miperfil-container">
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
        <div className="tipo-usuario">
          {usuario.tipo === "personal" ? "Empleado/Encargado" : "Usuario"}
        </div>
      </div>

      <div className="datos-container">
        <h3>Mis Datos</h3>
        {["nombre", "apellido", "correo", "telefono", "direccion", "usuario"].map((campo) => (
          <div key={campo} className="datos-item">
            <label>{campo.charAt(0).toUpperCase() + campo.slice(1)}:</label>
            {editando ? (
              <input
                value={usuario[campo]}
                onChange={(e) => handleChange(campo, e.target.value)}
              />
            ) : (
              <span>{usuario[campo]}</span>
            )}
          </div>
        ))}
        <div className="botones-editar">
          {editando ? (
            <>
              <button onClick={() => setEditando(false)}>Guardar</button>
              <button onClick={() => setEditando(false)}>Cancelar</button>
            </>
          ) : (
            <button onClick={() => setEditando(true)}>Editar Datos</button>
          )}
        </div>
      </div>

      {usuario.tipo === "usuariosapp" && (
        <div className="mis-compras">
          <h3>Mis Compras</h3>
          {usuario.compras.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Productos</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {usuario.compras.map((c) => (
                  <tr key={c.id}>
                    <td>{c.fecha}</td>
                    <td>{c.productos}</td>
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

      {usuario.tipo === "personal" && (
        <div className="mis-horarios">
          <h3>Mis Horarios</h3>
          {usuario.horarios.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Sucursal</th>
                  <th>Horario</th>
                </tr>
              </thead>
              <tbody>
                {usuario.horarios.map((h, i) => (
                  <tr key={i}>
                    <td>{h.sucursal}</td>
                    <td>{h.rango}</td>
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

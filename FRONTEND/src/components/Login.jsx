import { useState } from "react";
import axios from "axios";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { HOME } from "../routers/router";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const navigate = useNavigate();
  const handleSend = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        usuario,
        contraseña, // puede ser vacío para mesas
      });

      const data = response.data;

      if (data.success) {
        // Guardar datos en localStorage
        localStorage.setItem("usuarioLogueado", data.usuario);
        localStorage.setItem("tipoUsuario", data.tipo);
        if (data.tipo === "personal") localStorage.setItem("rol", data.rol);

        alert(`Inicio de sesión exitoso como ${data.tipo}`);
        navigate(HOME);

     } else {
        alert(data.message || "Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSend}>
        <h2>Iniciar sesión</h2>
        <input
          type="text"
          placeholder="Correo"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        {/* Solo mostrar input de contraseña para usuariosApp y personal */}
        <input
          type="password"
          placeholder="Contraseña (solo si aplica)"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
        />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default Login;

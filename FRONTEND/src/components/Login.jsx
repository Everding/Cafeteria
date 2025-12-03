import { useState } from "react";
import axios from "axios";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { MIPERFIL } from "../routers/router";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSend = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/login", { correo, contraseña });
      const data = response.data;

      console.log("Login response:", data);

      if (data.success) {
        //  Guardar el objeto usuario completo
        const usuarioObj = {
          id: data.usuario.idPersonal || data.usuario.idUsuarioApp || data.usuario.numeroMesa,
          correo: data.usuario.correo,
          idRol: data.usuario.idRol || null,
          imagen_url: data.usuario.imagen_url || null,
        };

        login(usuarioObj, data.tipo, data.token, usuarioObj.idRol);

        navigate(MIPERFIL);
      } else {
        alert(data.message || "Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al iniciar sesión. Revisa tu conexión o servidor.");
    }
  };

  return (
    <div className="login-container">
     <form className="login-form" onSubmit={handleSend}>
  <h2>Iniciar sesión</h2>
  <input
    type="text"
    placeholder="Correo electrónico"
    value={correo}
    onChange={(e) => setCorreo(e.target.value)}
    required
  />
  <input
    type="password"
    placeholder="Contraseña"
    value={contraseña}
    onChange={(e) => setContraseña(e.target.value)}
  />
  <button type="submit">Ingresar</button>
  <p className="forgot-password">
    <a href="/recuperar-contraseña">¿Olvidaste tu contraseña?</a>
  </p>
    <p className="registerNew">
    <a href="/Register">¿No tienes cuenta? Registrate </a>
  </p>
</form>
    </div>
  );
}

export default Login;

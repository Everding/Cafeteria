import { useState } from "react";
import axios from "axios";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";
import { HOME } from "../routers/router";

function Register() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [usuario, setUsuario] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validar contraseñas
    if (contraseña !== confirmarContraseña) {
      alert("Las contraseñas no coinciden. Por favor, verifica.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/register", {
        nombre,
        apellido,
        correo,
        contraseña,
        telefono,
        direccion,
        usuario,
      });

      const data = response.data;

      if (data.success) {
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        navigate("/Login");
      } else {
        alert(data.message || "No se pudo registrar el usuario.");
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error en el registro. Intenta nuevamente.");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Crear cuenta</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmarContraseña}
          onChange={(e) => setConfirmarContraseña(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          required
        />

        <button type="submit">Registrarse</button>

        <p className="login-text">
          ¿Ya tienes cuenta?{" "}
          <a href="/Login">Inicia sesión aquí</a>
        </p>
      </form>
    </div>
  );
}

export default Register;

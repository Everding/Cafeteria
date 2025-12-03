import { useState } from "react";
import axios from "axios";

export default function RecuperarContraseña() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/login/contrasena-olvidada", {
        correo,
      });

      setMensaje(response.data.message);
    } catch (error) {
      console.error(error);
      setMensaje("Error al enviar solicitud");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Recuperar contraseña</h2>

        <input
          type="email"
          placeholder="Correo registrado"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <button type="submit">Enviar enlace</button>

        {mensaje && <p>{mensaje}</p>}
      </form>
    </div>
  );
}
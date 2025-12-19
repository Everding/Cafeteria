import { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export default function RestablecerContraseña() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [nueva, setNueva] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/login/restablecer", {
  token,
  nuevaContrasena: nueva, // 
});


      setMensaje(response.data.message);
    } catch (err) {
      console.log(err);
      setMensaje("Error al restablecer contraseña: Solicitud inválida o expirada.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Restablecer contraseña</h2>

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          required
        />

        <button type="submit">Guardar nueva contraseña</button>

        {mensaje && <p className="recover-message">{mensaje}</p>}
      </form>
    </div>
  );
}

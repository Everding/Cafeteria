import React, { useState } from "react";
import "../../styles/Contactanos.css";

const Contactanos = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    asunto: "",
    mensaje: "",
  });

  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.correo || !formData.asunto || !formData.mensaje) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Envío simulado 
    console.log("Formulario enviado:", formData);

    setEnviado(true);
    setFormData({ nombre: "", correo: "", asunto: "", mensaje: "" });

    setTimeout(() => setEnviado(false), 5000); // Oculta mensaje después de 5s
  };

  return (
    <div className="contacto-container">
      <h2 className="titulo-contacto">Contáctanos</h2>
      <p className="subtitulo-contacto">
        ¿Tenés alguna duda, sugerencia o comentario? ¡Nos encantaría saber de vos!
      </p>

      <form className="contacto-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Tu nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="correo"
          placeholder="Tu correo electrónico"
          value={formData.correo}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="asunto"
          placeholder="Asunto"
          value={formData.asunto}
          onChange={handleChange}
          required
        />

        <textarea
          name="mensaje"
          placeholder="Tu mensaje..."
          rows="5"
          value={formData.mensaje}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">Enviar mensaje</button>

        {enviado && <p className="mensaje-exito">Tu mensaje ha sido enviado correctamente</p>}
      </form>

      <div className="info-contacto">
        <h3>O también podés visitarnos:</h3>
        <p>📍 Av. Café 1234, San Miguel de Tucumán, Argentina</p>
        <p>📞 381 555-1234</p>
        <p>📧 contacto@cafearg.com</p>
        <p>🕒 Lunes a Domingo: 8:00 - 22:00</p>
      </div>
    </div>
  );
};

export default Contactanos;

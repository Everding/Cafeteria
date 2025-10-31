import React, { useState } from "react";
import "../../styles/Nosotros/Reseñas.css";

const Reseñas = () => {
  // Simulación del usuario logeado 
  const usuarioEjemplo = {
    nombre: "Las pulgas",
    foto: "https://media.discordapp.net/attachments/1370209159169179719/1433571202068123648/AP1GczMW7MWGXtI7iCto9Lgp6f9mVoSeWh6wtgWzXScRamw5W04tMH7vV-wSCQw1221-h919-s-no-gm.png?ex=69052cb9&is=6903db39&hm=8dcfee9f84db72991f4d1547dfd5a5aa24420874e207324bae269a9d2f3f72ff&=&format=webp&quality=lossless&width=909&height=684",
  };

  const [reseñas, setReseñas] = useState([
    {
      id: 1,
      usuario: "María López",
      foto: "https://randomuser.me/api/portraits/women/68.jpg",
      texto: "Excelente atención y productos frescos. El café tiene un sabor increíble.",
      calificacion: 5,
    },
    {
      id: 2,
      usuario: "Juan Pérez",
      foto: "https://randomuser.me/api/portraits/men/32.jpg",
      texto: "Muy buena calidad, aunque el lugar estaba un poco lleno. Volveré sin dudas.",
      calificacion: 4,
    },
  ]);

  const [nuevaReseña, setNuevaReseña] = useState({
    texto: "",
    calificacion: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevaReseña({ ...nuevaReseña, [name]: value });
  };

  const handleAgregarReseña = (e) => {
    e.preventDefault();
    if (!nuevaReseña.texto || !nuevaReseña.calificacion) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const nueva = {
      id: reseñas.length + 1,
      usuario: usuarioEjemplo.nombre,
      foto: usuarioEjemplo.foto,
      texto: nuevaReseña.texto,
      calificacion: Number(nuevaReseña.calificacion),
    };

    setReseñas([...reseñas, nueva]);
    setNuevaReseña({ texto: "", calificacion: 0 });
  };

  const renderEstrellas = (num) => "⭐".repeat(num) + "☆".repeat(5 - num);

  return (
    <div className="reseñas-container">
      <h2 className="titulo">Reseñas de nuestros clientes</h2>


      <form className="reseña-form" onSubmit={handleAgregarReseña}>
        <h3>Hacer una reseña</h3>
        <textarea
          name="texto"
          placeholder="Escribe tu reseña..."
          value={nuevaReseña.texto}
          onChange={handleChange}
        />
        <select
          name="calificacion"
          value={nuevaReseña.calificacion}
          onChange={handleChange}
        >
          <option value="0">Calificación</option>
          <option value="1">1 estrella</option>
          <option value="2">2 estrellas</option>
          <option value="3">3 estrellas</option>
          <option value="4">4 estrellas</option>
          <option value="5">5 estrellas</option>
        </select>
        <button type="submit">Agregar reseña</button>
      </form>


      <div className="reseñas-grid">
        {reseñas.map((reseña) => (
          <div className="reseña-row" key={reseña.id}>

            <div className="reseña-user-card">
              <img
                src={
                  reseña.foto ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt={reseña.usuario}
              />
              <h4>{reseña.usuario}</h4>
            </div>

  
            <div className="reseña-text-card">
              <p>{reseña.texto}</p>
              <div className="reseña-estrellas">{renderEstrellas(reseña.calificacion)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reseñas;

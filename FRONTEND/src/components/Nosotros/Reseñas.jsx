import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "../../styles/Nosotros/Reseñas.css";

const Reseñas = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [reseñas, setReseñas] = useState([]);
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [cargando, setCargando] = useState(true);

  const cargarReseñas = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/resenas");
      setReseñas(res.data);
    } catch (error) {
      console.error("Error al obtener reseñas:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarReseñas();
  }, []);

  const handleAgregarReseña = async () => {
    if (!user || !user.idUsuarioApp) {
      navigate("/Login");
      return;
    }

    if (!comentario || !calificacion) {
      alert("Debes ingresar un comentario y una calificación");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/resenas",
        {
          id_usuario_app: user.idUsuarioApp,
          comentario,
          calificacion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReseñas((prev) => [
        {
          idResena: res.data.idResena,
          comentario,
          calificacion,
          usuario_app: user.usuario,
          foto: user.imagen_url,
          fecha_resena: new Date().toISOString(), // fecha actual
        },
        ...prev,
      ]);

      setComentario("");
      setCalificacion(5);
    } catch (error) {
      console.error("Error al enviar reseña:", error);
      alert("No se pudo enviar la reseña");
    }
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString() + " " + fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (cargando) return <p>Cargando reseñas...</p>;

  return (
    <div className="reseñas-container">
      <h2>Reseñas</h2>

      <div className="reseña-form">
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribe tu reseña"
        />
        <label>
          Calificación:
          <select
            value={calificacion}
            onChange={(e) => setCalificacion(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleAgregarReseña}>Agregar reseña</button>
      </div>

      <div className="reseñas-list">
        {reseñas.length === 0 ? (
          <p>No hay reseñas aún</p>
        ) : (
          reseñas.map((r) => (
          <div key={r.idResena} className="reseña-item">
    <img
      src={r.foto || "https://via.placeholder.com/48"}
      alt={r.usuario_app}
      onError={(e) => { e.target.src = "https://via.placeholder.com/48"; }}
    />
    
    <div className="reseña-header">
      <div className="user-info">
        <strong>{r.usuario_app}</strong>
        <span className="fecha">{r.fecha_resena && formatearFecha(r.fecha_resena)}</span>
      </div>
    </div>

    <div className="stars">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className="star"
          style={{ color: i < r.calificacion ? "#ffd700" : "#e1e8ed" }}
        >
          ★
        </span>
      ))}
    </div>
    <div className="reseña-content">
      <p>{r.comentario}</p>
    </div>
  </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reseñas;

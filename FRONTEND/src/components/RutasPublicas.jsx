import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const RutaPublica = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  // 🔒 Si ya hay sesión iniciada, redirige al inicio (o donde quieras)
  if (user) {
    return <Navigate to="/" replace />;
  }

  // ✅ Si no hay sesión, permite acceder
  return children;
};

export default RutaPublica;

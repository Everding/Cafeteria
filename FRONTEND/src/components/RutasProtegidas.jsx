import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

//  Reutilizable: permite controlar acceso por tipoUsuario o idRol
const RutaProtegida = ({ 
  children, 
  tiposPermitidos = [],    // Ej: ["personal", "cliente"]
  rolesPermitidos = []     // Ej: [1, 2] (Admin o Encargado)
}) => {
  const { user, tipo, idRol, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;
  if (!user) return <Navigate to="/login" />;

  //  Verificar si el tipo de usuario está permitido
  const tipoValido = 
    tiposPermitidos.length === 0 || tiposPermitidos.includes(tipo);

  //  Verificar si el rol (solo si es personal) está permitido
  const rolValido = 
    rolesPermitidos.length === 0 || 
    (tipo === "personal" && rolesPermitidos.includes(Number(idRol)));

  // Si no pasa ninguna de las condiciones = redirigir
  if (!tipoValido || !rolValido) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RutaProtegida;

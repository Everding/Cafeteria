import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // Objeto completo del usuario
  const [tipo, setTipo] = useState(null);   // "personal", "clientes", "usuariosapp"
  const [idRol, setIdRol] = useState(null); // Solo para personal
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar datos desde localStorage
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    const tipoGuardado = localStorage.getItem("tipo");
    const idRolGuardado = localStorage.getItem("idRol");
    const tokenGuardado = localStorage.getItem("token");

    if (usuarioGuardado && tipoGuardado) {
      setUser(JSON.parse(usuarioGuardado));
      setTipo(tipoGuardado);
      setIdRol(idRolGuardado ? Number(idRolGuardado) : null);
      setToken(tokenGuardado);
    }
    setLoading(false);
  }, []);

  // 🔹 Guardar sesión
  const login = (usuarioObj, tipoUsuario, tokenRecibido, idRolUsuario = null) => {
    setUser(usuarioObj);
    setTipo(tipoUsuario);
    setIdRol(idRolUsuario || usuarioObj?.idRol || null);
    setToken(tokenRecibido);

    localStorage.setItem("usuario", JSON.stringify(usuarioObj)); // ✅ guardar como objeto
    localStorage.setItem("tipo", tipoUsuario);
    if (idRolUsuario || usuarioObj?.idRol) localStorage.setItem("idRol", idRolUsuario || usuarioObj.idRol);
    localStorage.setItem("token", tokenRecibido);
  };

  // 🔹 Cerrar sesión
  const logout = () => {
    setUser(null);
    setTipo(null);
    setIdRol(null);
    setToken(null);

    localStorage.removeItem("usuario");
    localStorage.removeItem("tipo");
    localStorage.removeItem("idRol");
    localStorage.removeItem("token");
  };

  return (
  <AuthContext.Provider value={{ user, tipo, idRol, token, login, logout, loading, setUser }}>
  {children}
</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

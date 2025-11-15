import jwt from "jsonwebtoken";
const SECRET_KEY = "mi_secreto_jwt";


export const verificarToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Token requerido" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = {
      id: decoded.idPersonal || decoded.idUsuarioApp || decoded.idCliente,
      tipo: decoded.tipo, // "personal" o "usuariosapp"
      rolID: decoded.rolID || null,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};


// Filtros por tipo de usuario
export const soloPersonal = (req, res, next) => {
  if (req.user.tipo !== "personal")
    return res.status(403).json({ message: "Acceso solo para personal" });
  next();
};

export const soloUsuariosApp = (req, res, next) => {
  if (req.user.tipo !== "usuariosapp")
    return res.status(403).json({ message: "Acceso solo para usuarios de la app" });
  next();
};

export const soloMesas = (req, res, next) => {
  if (req.user.tipo !== "clientes")
    return res.status(403).json({ message: "Acceso solo para mesas" });
  next();
};

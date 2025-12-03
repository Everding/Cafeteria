import jwt from "jsonwebtoken";

const SECRET_KEY = "mi_secreto_jwt"; // misma clave del login

// =============================
//   MIDDLEWARE PRINCIPAL
// =============================
export const verificarToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // 🔹 Detectamos el ID correcto según el tipo
    req.user = {
      id:
        decoded.idUsuarioApp ||
        decoded.idPersonal ||
        decoded.idCliente ||
        null,

      tipo: decoded.tipo,       // "usuariosapp", "personal", "clientes"
      idRol: decoded.idRol || null,
    };

    next();
  } catch (error) {
    console.error("Error verificando token:", error);
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// =============================
//   FILTROS POR TIPO DE USUARIO
// =============================
export const soloPersonal = (req, res, next) => {
  if (req.user.tipo !== "personal") {
    return res.status(403).json({ message: "Acceso permitido solo al personal" });
  }
  next();
};

export const soloUsuariosAppOClientes = (req, res, next) => {
  if (req.user.tipo === "usuariosapp" || req.user.tipo === "clientes") {
    return next();
  }
  return res.status(403).json({ 
    message: "Acceso permitido solo a usuarios de la app o clientes" 
  });
};

export const soloMesas = (req, res, next) => {
  if (req.user.tipo !== "clientes") {
    return res.status(403).json({ message: "Acceso permitido solo a mesas" });
  }
  next();
};

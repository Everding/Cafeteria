import db from "../config/dataBase.js";

// Obtener usuarios de la app
export const getUsuariosApp = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM UsuariosApp");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

// Registrar nuevo usuario app
export const createUsuarioApp = async (req, res) => {
  try {
    const { nombreUsuario, email, contraseña, idCliente } = req.body;
    await db.query(
      "INSERT INTO UsuariosApp (nombreUsuario, email, contraseña, idCliente) VALUES (?, ?, ?, ?)",
      [nombreUsuario, email, contraseña, idCliente]
    );
    res.json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};

// Iniciar sesión (sin bcrypt)
export const loginUsuarioApp = async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    const [rows] = await db.query("SELECT * FROM UsuariosApp WHERE email = ? AND contraseña = ?", [email, contraseña]);

    if (rows.length > 0) {
      res.json({ message: "Inicio de sesión exitoso", usuario: rows[0] });
    } else {
      res.status(401).json({ message: "Email o contraseña incorrectos" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

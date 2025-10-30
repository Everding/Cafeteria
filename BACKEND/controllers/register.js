import db from "../config/dataBase.js";

export const registerUsuarioApp = async (req, res) => {
  const { nombre, apellido, correo, contraseña, telefono, direccion, usuario } = req.body;

  try {
    // Verificar si el correo o usuario ya existen
    const [existe] = await db.query(
      "SELECT * FROM UsuariosApp WHERE correo = ? OR usuario = ?",
      [correo, usuario]
    );

    if (existe.length > 0) {
      return res.status(400).json({ success: false, message: "El usuario o correo ya existe." });
    }

    // Insertar nuevo usuario
    await db.query(
      "INSERT INTO UsuariosApp (nombre, apellido, correo, contraseña, telefono, direccion, usuario) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nombre, apellido, correo, contraseña, telefono, direccion, usuario]
    );

    res.json({ success: true, message: "Usuario registrado correctamente." });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ success: false, message: "Error en el servidor", error });
  }
};

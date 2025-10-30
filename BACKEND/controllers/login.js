import db from "../config/dataBase.js";

export const loginGeneral = async (req, res) => {
  const { usuario, contraseña } = req.body; // puede ser correo o número de mesa

  try {
    let rows; // ✅ Inicializada correctamente

    // 🔹 Buscar en UsuariosApp (clientes con cuenta)
    [rows] = await db.query(
      "SELECT correo, usuario FROM UsuariosApp WHERE (correo = ? OR usuario = ?) AND contraseña = ?",
      [usuario, usuario, contraseña]
    );

    if (rows.length > 0) {
      return res.json({
        success: true,
        tipo: "usuariosapp",
        usuario: rows[0].usuario,
        correo: rows[0].correo,
      });
    }

    // 🔹 Buscar en Personal (administrador, encargado, empleado)
    [rows] = await db.query(
      "SELECT correo, idRol FROM Personal WHERE correo = ? AND contraseña = ?",
      [usuario, contraseña]
    );

    if (rows.length > 0) {
      return res.json({
        success: true,
        tipo: "personal",
        usuario: rows[0].correo,
        rol: rows[0].idRol,
      });
    }

    // 🔹 Buscar en Clientes (mesas)
    [rows] = await db.query(
      "SELECT numeroMesa, estado FROM Clientes WHERE numeroMesa = ?",
      [usuario]
    );

    if (rows.length > 0) {
      const mesa = rows[0];

      if (mesa.estado === "Disponible" || mesa.estado === "Reservada") {
        // Cambiar estado a 'Ocupada'
        await db.query("UPDATE Clientes SET estado = 'Ocupada' WHERE numeroMesa = ?", [usuario]);

        return res.json({
          success: true,
          tipo: "clientes",
          usuario: mesa.numeroMesa,
        });
      } else {
        return res.json({ success: false, message: "La mesa ya está ocupada" });
      }
    }

    // 🔹 Ningún usuario coincide
    res.json({ success: false, message: "Usuario o contraseña incorrectos" });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ success: false, message: "Error en el servidor", error });
  }
};

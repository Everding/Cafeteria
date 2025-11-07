import db from "../config/dataBase.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET_KEY = "mi_secreto_jwt"; // ⚠️ usa variable de entorno en producción

export const loginGeneral = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    let rows;

    // ===== 1. UsuariosApp =====
    [rows] = await db.query(
      "SELECT idUsuarioApp, correo, contraseña FROM UsuariosApp WHERE correo = ?",
      [correo]
    );

    if (rows.length > 0) {
      const user = rows[0];

      const validPassword =
        (await bcrypt.compare(contraseña, user.contraseña)) ||
        contraseña === user.contraseña;

      if (!validPassword)
        return res.status(401).json({ message: "Contraseña incorrecta" });

      const token = jwt.sign(
        { id: user.idUsuarioApp, tipo: "usuariosapp" },
        SECRET_KEY,
        { expiresIn: "2h" }
      );

      return res.json({
        success: true,
        tipo: "usuariosapp",
        usuario: {
          idUsuarioApp: user.idUsuarioApp,
          correo: user.correo,
          imagen_url: null, // no tienen foto
        },
        token,
      });
    }

    // ===== 2. Personal =====
    [rows] = await db.query(
      "SELECT idPersonal, correo, contraseña, idRol, imagen_url FROM Personal WHERE correo = ?",
      [correo]
    );

    if (rows.length > 0) {
      const user = rows[0];

      const validPassword =
        (await bcrypt.compare(contraseña, user.contraseña)) ||
        contraseña === user.contraseña;

      if (!validPassword)
        return res.status(401).json({ message: "Contraseña incorrecta" });

      const token = jwt.sign(
        { id: user.idPersonal, tipo: "personal", idRol: user.idRol },
        SECRET_KEY,
        { expiresIn: "2h" }
      );

      return res.json({
        success: true,
        tipo: "personal",
        usuario: {
          idPersonal: user.idPersonal,
          correo: user.correo,
          idRol: user.idRol,
          imagen_url: user.imagen_url || null,
        },
        token,
      });
    }

    // ===== 3. Clientes (Mesas) =====
    [rows] = await db.query(
      "SELECT numeroMesa, estado FROM clientes WHERE numeroMesa = ?",
      [correo]
    );

    if (rows.length > 0) {
      const mesa = rows[0];

      if (mesa.estado === "Disponible" || mesa.estado === "Reservada") {
        await db.query(
          "UPDATE Clientes SET estado = 'Ocupada' WHERE numeroMesa = ?",
          [correo]
        );

        const token = jwt.sign(
          { numeroMesa: mesa.numeroMesa, tipo: "clientes" },
          SECRET_KEY,
          { expiresIn: "4h" }
        );

        return res.json({
          success: true,
          tipo: "clientes",
          usuario: {
            numeroMesa: mesa.numeroMesa,
            imagen_url: null,
          },
          token,
        });
      } else {
        return res.json({
          success: false,
          message: "La mesa ya está ocupada",
        });
      }
    }

    // ===== Ningún usuario coincide =====
    return res.status(401).json({
      success: false,
      message: "Correo o contraseña incorrectos",
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

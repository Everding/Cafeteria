import db from "../config/dataBase.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const SECRET_KEY = "mi_secreto_jwt"; // para login
const RESET_SECRET = "mi_secreto_reset_123"; // para restablecer contraseña

// ========================
// LOGIN GENERAL (SIN CAMBIOS)
// ========================
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
        {
          idUsuarioApp: user.idUsuarioApp,
          tipo: "usuariosapp",
        },
        SECRET_KEY,
        { expiresIn: "2h" }
      );

      return res.json({
        success: true,
        tipo: "usuariosapp",
        usuario: {
          idUsuarioApp: user.idUsuarioApp,
          correo: user.correo,
          imagen_url: null,
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
        {
          idPersonal: user.idPersonal,
          tipo: "personal",
          idRol: user.idRol,
        },
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
      "SELECT idCliente, numeroMesa, estado FROM Clientes WHERE numeroMesa = ?",
      [correo]
    );

    if (rows.length > 0) {
      const mesa = rows[0];

      if (mesa.estado === "Disponible" || mesa.estado === "Reservada") {
        await db.query("UPDATE Clientes SET estado = 'Ocupada' WHERE numeroMesa = ?", [
          correo,
        ]);

        const token = jwt.sign(
          {
            idCliente: mesa.idCliente,
            numeroMesa: mesa.numeroMesa,
            tipo: "clientes",
          },
          SECRET_KEY,
          { expiresIn: "4h" }
        );

        return res.json({
          success: true,
          tipo: "clientes",
          usuario: {
            idCliente: mesa.idCliente,
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



// ========================
// 1. ENVIAR CORREO CON TOKEN
// ========================
export const contrasenaOlvidada = async (req, res) => {
  const { correo } = req.body;

  if (!correo)
    return res.status(400).json({ success: false, message: "Correo requerido" });

  try {
    // Buscar usuario en ambas tablas
    const [rowsApp] = await db.query(
      "SELECT idUsuarioApp FROM UsuariosApp WHERE correo = ?",
      [correo]
    );

    const [rowsPersonal] = await db.query(
      "SELECT idPersonal FROM Personal WHERE correo = ?",
      [correo]
    );

    let userId = null;
    let tipo = null;

    if (rowsApp.length > 0) {
      userId = rowsApp[0].idUsuarioApp;
      tipo = "usuariosapp";
    } else if (rowsPersonal.length > 0) {
      userId = rowsPersonal[0].idPersonal;
      tipo = "personal";
    } else {
      return res.json({
        success: true,
        message: "Si el correo existe, se enviará un enlace"
      });
    }

    // Token válido por 15 minutos
    const resetToken = jwt.sign(
      { id: userId, tipo },
      RESET_SECRET,
      { expiresIn: "15m" }
    );

    const enlace = `http://localhost:5173/restablecer?token=${resetToken}`;

    // 📌 Transporter Gmail correcto
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "everdinglol@gmail.com",
        pass: "kjfd xgfx gblv ienv",
      },
    });

    await transporter.sendMail({
      from: `"Cafetería App" <everdinglol@gmail.com>`,
      to: correo,
      subject: "Restablecer contraseña",
      html: `
        <h2>Restablecer contraseña</h2>
        <p>Haz clic en el enlace para continuar:</p>
        <a href="${enlace}" target="_blank">Restablecer contraseña</a>
        <p>Este enlace expira en 15 minutos.</p>
      `
    });

    return res.json({
      success: true,
      message: "Se ha enviado un enlace para restablecer la contraseña"
    });

  } catch (error) {
    console.error("Error en contrasenaOlvidada:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};


// ========================
// 2. RESTABLECER CONTRASEÑA
// ========================
export const restablecerContrasena = async (req, res) => {
  const { token, nuevaContrasena } = req.body;

  if (!token || !nuevaContrasena)
    return res.status(400).json({ success: false, message: "Datos incompletos" });

  try {
    let decoded;

    // Verificar token
    try {
      decoded = jwt.verify(token, RESET_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Token inválido o expirado" });
    }

    const hashed = await bcrypt.hash(nuevaContrasena, 10);

    // UsuariosApp
    if (decoded.tipo === "usuariosapp") {
      await db.query(
        "UPDATE UsuariosApp SET contraseña = ? WHERE idUsuarioApp = ?",
        [hashed, decoded.id]
      );
    }

    // Personal
    if (decoded.tipo === "personal") {
      await db.query(
        "UPDATE Personal SET contraseña = ? WHERE idPersonal = ?",
        [hashed, decoded.id]
      );
    }

    return res.json({ success: true, message: "Contraseña actualizada correctamente" });

  } catch (error) {
    console.error("Error restablecerContrasena:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

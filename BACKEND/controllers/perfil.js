import db from "../config/dataBase.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";

// ===============================
// CONFIGURACIÓN DE MULTER (para subir fotos)
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads/perfiles");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

// ===============================
// GET /api/perfil → datos del usuario logueado
// ===============================
export const getPerfil = async (req, res) => {
  try {
    const { tipo } = req.user;

    // 🔹 PERFIL DE USUARIO APP
    if (tipo === "usuariosapp") {
      const [userRows] = await db.query(
        `SELECT idUsuarioApp, nombre, apellido, correo, telefono, direccion, usuario, imagen_url 
         FROM UsuariosApp 
         WHERE idUsuarioApp = ?`,
        [req.user.id]
      );

      if (userRows.length === 0)
        return res.status(404).json({ message: "Usuario no encontrado" });

      // 🔹 Obtener las 5 compras más recientes del usuario
      const [compras] = await db.query(
        `
        SELECT v.idVenta, v.fecha_venta, v.total
        FROM Ventas v
        JOIN Pedidos p ON v.idPedido = p.idPedido
        WHERE p.id_usuario_app = ?
        ORDER BY v.fecha_venta DESC
        LIMIT 5
        `,
        [req.user.id] // ✅ CORREGIDO
      );

      return res.json({
        tipo,
        perfil: userRows[0],
        compras,
      });
    }

    // 🔹 PERFIL DE PERSONAL
    if (tipo === "personal") {
      const [userRows] = await db.query(
        `SELECT idPersonal, nombre, apellido, correo, dni, idRol, imagen_url
         FROM Personal
         WHERE idPersonal = ?`,
        [req.user.id]
      );

      if (userRows.length === 0)
        return res.status(404).json({ message: "Empleado no encontrado" });

      // ⏰ Horarios de la semana actual
      const [horarios] = await db.query(
        `SELECT a.idAsignacion, a.idSucursal, a.idTurno, a.fechaInicioSemana, a.fechaFinSemana
         FROM AsignacionSemanal a
         WHERE a.idPersonal = ?
         ORDER BY a.fechaInicioSemana DESC
         LIMIT 1`,
        [req.user.id]
      );

      return res.json({
        tipo,
        perfil: userRows[0],
        horarios,
      });
    }

    res.status(400).json({ message: "Tipo de usuario no reconocido" });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
};

// ===============================
// PUT /api/perfil/imagen → actualizar foto
// ===============================
export const actualizarImagenPerfil = async (req, res) => {
  try {
    const { tipo } = req.user;
    const id = req.user.id;

    if (!req.file)
      return res.status(400).json({ message: "No se subió ninguna imagen" });

    const nuevaImagenUrl = `${req.protocol}://${req.get("host")}/uploads/perfiles/${req.file.filename}`;

    // Determinar tabla y campo según tipo
    const tabla = tipo === "usuariosapp" ? "UsuariosApp" : "Personal";
    const idCampo = tipo === "usuariosapp" ? "idUsuarioApp" : "idPersonal";

    // 🔹 Verificar si el registro existe antes de actualizar
    const [user] = await db.query(
      `SELECT imagen_url FROM ${tabla} WHERE ${idCampo} = ?`,
      [id]
    );

    if (user.length === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // 🔹 Si ya tiene imagen, eliminarla del servidor
    if (user[0].imagen_url) {
      const rutaLocal = path.resolve(
        user[0].imagen_url.replace(`${req.protocol}://${req.get("host")}/`, "")
      );
      if (fs.existsSync(rutaLocal)) {
        try {
          fs.unlinkSync(rutaLocal);
        } catch (err) {
          console.warn("No se pudo eliminar la imagen anterior:", err);
        }
      }
    }

    // 🔹 Actualizar la nueva imagen
    await db.query(
      `UPDATE ${tabla} SET imagen_url = ? WHERE ${idCampo} = ?`,
      [nuevaImagenUrl, id]
    );

    res.json({
      message: "Imagen actualizada correctamente",
      imagen_url: nuevaImagenUrl,
    });
  } catch (error) {
    console.error("Error al actualizar imagen:", error);
    res.status(500).json({ message: "Error al actualizar imagen", error: error.message });
  }
};

// ===============================
// PUT /api/perfil/password → cambiar contraseña
// ===============================
export const cambiarPassword = async (req, res) => {
  try {
    const { actual, nueva } = req.body;
    const { tipo } = req.user;

    if (!actual || !nueva)
      return res.status(400).json({ message: "Faltan contraseñas" });

    const tabla = tipo === "usuariosapp" ? "UsuariosApp" : "Personal";
    const idCampo = tipo === "usuariosapp" ? "idUsuarioApp" : "idPersonal";

    const [rows] = await db.query(
      `SELECT contraseña FROM ${tabla} WHERE ${idCampo} = ?`,
      [req.user.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const passwordValida =
      (await bcrypt.compare(actual, rows[0].contraseña)) ||
      actual === rows[0].contraseña;

    if (!passwordValida)
      return res.status(401).json({ message: "Contraseña actual incorrecta" });

    const hashNueva = await bcrypt.hash(nueva, 10);
    await db.query(
      `UPDATE ${tabla} SET contraseña = ? WHERE ${idCampo} = ?`,
      [hashNueva, req.user.id]
    );

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({ message: "Error al cambiar contraseña" });
  }
};

export const actualizarPerfil = async (req, res) => {
  try {
    const { tipo } = req.user;
    const id = req.user.id;
    const { nombre, apellido, correo, telefono, direccion, usuario } = req.body;

    if (tipo === "usuariosapp") {
      // 🔹 Usuarios de la app
      await db.query(
        `UPDATE UsuariosApp 
         SET nombre = ?, apellido = ?, correo = ?, telefono = ?, direccion = ?, usuario = ?
         WHERE idUsuarioApp = ?`,
        [nombre, apellido, correo, telefono, direccion, usuario, id]
      );
    } else if (tipo === "personal") {
      // 🔹 Personal del local (sin teléfono, dirección ni usuario)
      await db.query(
        `UPDATE Personal 
         SET nombre = ?, apellido = ?, correo = ?
         WHERE idPersonal = ?`,
        [nombre, apellido, correo, id]
      );
    } else {
      return res.status(400).json({ message: "Tipo de usuario no válido" });
    }

    res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ message: "Error al actualizar perfil", error: error.message });
  }
};

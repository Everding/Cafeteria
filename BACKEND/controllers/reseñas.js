import db from "../config/dataBase.js";

// ===============================
// Obtener todas las reseñas
// ===============================
export const getAllResenas = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.idResena,
             r.calificacion,
             r.comentario,
             r.fecha_resena,
             u.usuario AS usuario_app,
             u.imagen_url AS foto
      FROM reseñas r
      LEFT JOIN usuariosApp u ON r.id_usuario_app = u.idUsuarioApp
      ORDER BY r.fecha_resena DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.status(500).json({ message: "Error al obtener reseñas" });
  }
};

// ===============================
// Obtener reseña por ID
// ===============================
export const getResenaById = async (req, res) => {
  try {
    const { idResena } = req.params;
    const [rows] = await db.query(`
      SELECT r.idResena,
             r.calificacion,
             r.comentario,
             r.fecha_resena,
             u.usuario AS usuario_app,
             u.imagen_url AS foto
      FROM reseñas r
      LEFT JOIN usuariosApp u ON r.id_usuario_app = u.idUsuarioApp
      WHERE r.idResena = ?
    `, [idResena]);

    if (!rows.length) return res.status(404).json({ message: "Reseña no encontrada" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener reseña:", error);
    res.status(500).json({ message: "Error al obtener reseña" });
  }
};

// ===============================
// Crear nueva reseña (solo usuariosApp)
// ===============================
export const createResena = async (req, res) => {
  try {
    const { id_usuario_app, calificacion, comentario } = req.body;

    if (!id_usuario_app) {
      return res.status(400).json({ message: "Solo usuariosApp pueden crear reseñas" });
    }

    if (!calificacion || calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ message: "La calificación debe ser un número entre 1 y 5" });
    }

    const [result] = await db.query(`
      INSERT INTO reseñas (id_usuario_app, calificacion, comentario, fecha_resena)
      VALUES (?, ?, ?, NOW())
    `, [
      id_usuario_app,
      calificacion,
      comentario || ""
    ]);

    res.status(201).json({ message: "Reseña creada correctamente", idResena: result.insertId });
  } catch (error) {
    console.error("Error al crear reseña:", error);
    res.status(500).json({ message: "Error al crear reseña" });
  }
};

// ===============================
// Actualizar reseña
// ===============================
export const updateResena = async (req, res) => {
  try {
    const { idResena } = req.params;
    const { calificacion, comentario } = req.body;

    if (calificacion && (calificacion < 1 || calificacion > 5)) {
      return res.status(400).json({ message: "La calificación debe ser un número entre 1 y 5" });
    }

    await db.query(`
      UPDATE reseñas
      SET calificacion = ?, comentario = ?
      WHERE idResena = ?
    `, [calificacion, comentario, idResena]);

    res.json({ message: "Reseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar reseña:", error);
    res.status(500).json({ message: "Error al actualizar reseña" });
  }
};

// ===============================
// Eliminar reseña
// ===============================
export const deleteResena = async (req, res) => {
  try {
    const { idResena } = req.params;
    await db.query("DELETE FROM reseñas WHERE idResena = ?", [idResena]);
    res.json({ message: "Reseña eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar reseña:", error);
    res.status(500).json({ message: "Error al eliminar reseña" });
  }
};

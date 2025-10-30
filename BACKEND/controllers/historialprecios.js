import db from "../config/dataBase.js";

// Obtener todos los cambios de precio

export const getAllHistorialPrecios = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT h.id_historial, h.id_producto, p.nombre AS nombre_producto,
             h.precio_anterior, h.precio_nuevo, h.fecha_cambio
      FROM historial_precios h
      LEFT JOIN productos p ON h.id_producto = p.id_producto
      ORDER BY h.fecha_cambio DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener historial de precios:", error);
    res.status(500).json({ message: "Error al obtener historial de precios" });
  }
};


// Agregar un nuevo registro de historial de precios

export const addHistorialPrecio = async (req, res) => {
  try {
    const { id_producto, precio_anterior, precio_nuevo } = req.body;

    if (!id_producto || precio_anterior == null || precio_nuevo == null) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await db.query(`
      INSERT INTO historial_precios (id_producto, precio_anterior, precio_nuevo, fecha_cambio)
      VALUES (?, ?, ?, NOW())
    `, [id_producto, precio_anterior, precio_nuevo]);

    res.status(201).json({ message: "Historial de precio registrado", id_historial: result.insertId });
  } catch (error) {
    console.error("Error al agregar historial de precio:", error);
    res.status(500).json({ message: "Error al agregar historial de precio" });
  }
};


// Obtener historial por producto

export const getHistorialByProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;

    const [rows] = await db.query(`
      SELECT h.id_historial, h.id_producto, p.nombre AS nombre_producto,
             h.precio_anterior, h.precio_nuevo, h.fecha_cambio
      FROM historial_precios h
      LEFT JOIN productos p ON h.id_producto = p.id_producto
      WHERE h.id_producto = ?
      ORDER BY h.fecha_cambio DESC
    `, [id_producto]);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener historial de producto:", error);
    res.status(500).json({ message: "Error al obtener historial de producto" });
  }
};

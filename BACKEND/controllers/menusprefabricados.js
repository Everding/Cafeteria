import db from "../config/dataBase.js";

// ===============================
// Obtener todos los menús
// ===============================
export const getAllMenusPrefabricados = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id_menu, nombre, descripcion, precio_total, estado, imagen_url
      FROM menusprefabricados
      ORDER BY nombre ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener menús:", error);
    res.status(500).json({ message: "Error al obtener menús" });
  }
};

// ===============================
// Obtener menú por ID
// ===============================
export const getMenuPrefabricadoById = async (req, res) => {
  try {
    const { id_menu } = req.params;
    const [rows] = await db.query(`
      SELECT id_menu, nombre, descripcion, precio_total, estado, imagen_url
      FROM menusprefabricados
      WHERE id_menu = ?
    `, [id_menu]);

    if (!rows.length) return res.status(404).json({ message: "Menú no encontrado" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener menú:", error);
    res.status(500).json({ message: "Error al obtener menú" });
  }
};

// ===============================
// Crear menú
// ===============================
export const createMenuPrefabricado = async (req, res) => {
  try {
    const { nombre, descripcion, precio_total, estado } = req.body;

    if (!nombre || precio_total == null || !estado) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const imagen_url = req.file ? `/uploads/${req.file.filename}` : 'https://via.placeholder.com/150';

    const [result] = await db.query(`
      INSERT INTO menusprefabricados (nombre, descripcion, precio_total, estado, imagen_url)
      VALUES (?, ?, ?, ?, ?)
    `, [nombre, descripcion || '', precio_total, estado, imagen_url]);

    const [newMenu] = await db.query("SELECT * FROM menusprefabricados WHERE id_menu = ?", [result.insertId]);
    res.status(201).json(newMenu[0]);
  } catch (error) {
    console.error("Error al crear menú:", error);
    res.status(500).json({ message: "Error al crear menú" });
  }
};

// ===============================
// Actualizar menú (con imagen)
// ===============================
export const updateMenuPrefabricado = async (req, res) => {
  try {
    const { id_menu } = req.params;
    const { nombre, descripcion, precio_total, estado } = req.body;

    // Construir imagen_url solo si hay archivo
    const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;

    await db.query(`
      UPDATE menusprefabricados
      SET nombre = ?, descripcion = ?, precio_total = ?, estado = ?, imagen_url = COALESCE(?, imagen_url)
      WHERE id_menu = ?
    `, [nombre, descripcion, precio_total, estado, imagen_url, id_menu]);

    const [updatedMenu] = await db.query("SELECT * FROM menusprefabricados WHERE id_menu = ?", [id_menu]);
    res.json(updatedMenu[0]);
  } catch (error) {
    console.error("Error al actualizar menú:", error);
    res.status(500).json({ message: "Error al actualizar menú" });
  }
};

// ===============================
// Eliminar menú
// ===============================
export const deleteMenuPrefabricado = async (req, res) => {
  try {
    const { id_menu } = req.params;
    await db.query("DELETE FROM menusprefabricados WHERE id_menu = ?", [id_menu]);
    res.json({ message: "Menú eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar menú:", error);
    res.status(500).json({ message: "Error al eliminar menú" });
  }
};

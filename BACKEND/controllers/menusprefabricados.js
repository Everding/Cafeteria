import db from "../config/dataBase.js";

// Obtener todos los menús prefabricados

export const getAllMenusPrefabricados = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id_menu, nombre, descripcion, precio_total, estado
      FROM menus_prefabricados
      ORDER BY nombre ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener menús prefabricados:", error);
    res.status(500).json({ message: "Error al obtener menús prefabricados" });
  }
};


// Obtener un menú por ID

export const getMenuPrefabricadoById = async (req, res) => {
  try {
    const { id_menu } = req.params;
    const [rows] = await db.query(`
      SELECT id_menu, nombre, descripcion, precio_total, estado
      FROM menus_prefabricados
      WHERE id_menu = ?
    `, [id_menu]);

    if (!rows.length) return res.status(404).json({ message: "Menú no encontrado" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener menú prefabricado:", error);
    res.status(500).json({ message: "Error al obtener menú prefabricado" });
  }
};


// Crear nuevo menú prefabricado

export const createMenuPrefabricado = async (req, res) => {
  try {
    const { nombre, descripcion, precio_total, estado } = req.body;

    if (!nombre || precio_total == null || !estado) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await db.query(`
      INSERT INTO menus_prefabricados (nombre, descripcion, precio_total, estado)
      VALUES (?, ?, ?, ?)
    `, [nombre, descripcion || "", precio_total, estado]);

    res.status(201).json({ message: "Menú prefabricado creado", id_menu: result.insertId });
  } catch (error) {
    console.error("Error al crear menú prefabricado:", error);
    res.status(500).json({ message: "Error al crear menú prefabricado" });
  }
};


// Actualizar menú prefabricado

export const updateMenuPrefabricado = async (req, res) => {
  try {
    const { id_menu } = req.params;
    const { nombre, descripcion, precio_total, estado } = req.body;

    await db.query(`
      UPDATE menus_prefabricados
      SET nombre = ?, descripcion = ?, precio_total = ?, estado = ?
      WHERE id_menu = ?
    `, [nombre, descripcion, precio_total, estado, id_menu]);

    res.json({ message: "Menú prefabricado actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar menú prefabricado:", error);
    res.status(500).json({ message: "Error al actualizar menú prefabricado" });
  }
};


// Eliminar menú prefabricado

export const deleteMenuPrefabricado = async (req, res) => {
  try {
    const { id_menu } = req.params;
    await db.query("DELETE FROM menus_prefabricados WHERE id_menu = ?", [id_menu]);
    res.json({ message: "Menú prefabricado eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar menú prefabricado:", error);
    res.status(500).json({ message: "Error al eliminar menú prefabricado" });
  }
};

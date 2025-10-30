import db from "../config/dataBase.js";


// Obtener todos los proveedores

export const getAllProveedores = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id_proveedor, nombre, email, telefono, direccion
      FROM proveedores
      ORDER BY nombre ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    res.status(500).json({ message: "Error al obtener proveedores" });
  }
};


// Obtener proveedor por ID

export const getProveedorById = async (req, res) => {
  try {
    const { id_proveedor } = req.params;
    const [rows] = await db.query(`
      SELECT id_proveedor, nombre, email, telefono, direccion
      FROM proveedores
      WHERE id_proveedor = ?
    `, [id_proveedor]);

    if (!rows.length) return res.status(404).json({ message: "Proveedor no encontrado" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener proveedor:", error);
    res.status(500).json({ message: "Error al obtener proveedor" });
  }
};


// Crear nuevo proveedor

export const createProveedor = async (req, res) => {
  try {
    const { nombre, email, telefono, direccion } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre del proveedor es obligatorio" });
    }

    const [result] = await db.query(`
      INSERT INTO proveedores (nombre, email, telefono, direccion)
      VALUES (?, ?, ?, ?)
    `, [nombre, email || "", telefono || "", direccion || ""]);

    res.status(201).json({ message: "Proveedor creado", id_proveedor: result.insertId });
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    res.status(500).json({ message: "Error al crear proveedor" });
  }
};


// Actualizar proveedor

export const updateProveedor = async (req, res) => {
  try {
    const { id_proveedor } = req.params;
    const { nombre, email, telefono, direccion } = req.body;

    await db.query(`
      UPDATE proveedores
      SET nombre = ?, email = ?, telefono = ?, direccion = ?
      WHERE id_proveedor = ?
    `, [nombre, email, telefono, direccion, id_proveedor]);

    res.json({ message: "Proveedor actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    res.status(500).json({ message: "Error al actualizar proveedor" });
  }
};


// Eliminar proveedor

export const deleteProveedor = async (req, res) => {
  try {
    const { id_proveedor } = req.params;
    await db.query("DELETE FROM proveedores WHERE id_proveedor = ?", [id_proveedor]);
    res.json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    res.status(500).json({ message: "Error al eliminar proveedor" });
  }
};

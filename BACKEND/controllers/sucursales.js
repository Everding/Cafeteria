import db from "../config/dataBase.js";


// Obtener todas las sucursales

export const getAllSucursales = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT idSucursal, nombreSucursal, direccion
      FROM sucursales
      ORDER BY nombreSucursal ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener sucursales:", error);
    res.status(500).json({ message: "Error al obtener sucursales" });
  }
};


// Obtener sucursal por ID

export const getSucursalById = async (req, res) => {
  try {
    const { idSucursal } = req.params;
    const [rows] = await db.query(`
      SELECT idSucursal, nombreSucursal, direccion
      FROM sucursales
      WHERE idSucursal = ?
    `, [idSucursal]);

    if (!rows.length) return res.status(404).json({ message: "Sucursal no encontrada" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener sucursal:", error);
    res.status(500).json({ message: "Error al obtener sucursal" });
  }
};


// Crear nueva sucursal

export const createSucursal = async (req, res) => {
  try {
    const { nombreSucursal, direccion } = req.body;

    if (!nombreSucursal) {
      return res.status(400).json({ message: "El nombre de la sucursal es obligatorio" });
    }

    const [result] = await db.query(`
      INSERT INTO sucursales (nombreSucursal, direccion)
      VALUES (?, ?)
    `, [nombreSucursal, direccion || ""]);

    res.status(201).json({ message: "Sucursal creada", idSucursal: result.insertId });
  } catch (error) {
    console.error("Error al crear sucursal:", error);
    res.status(500).json({ message: "Error al crear sucursal" });
  }
};


// Actualizar sucursal

export const updateSucursal = async (req, res) => {
  try {
    const { idSucursal } = req.params;
    const { nombreSucursal, direccion } = req.body;

    await db.query(`
      UPDATE sucursales
      SET nombreSucursal = ?, direccion = ?
      WHERE idSucursal = ?
    `, [nombreSucursal, direccion, idSucursal]);

    res.json({ message: "Sucursal actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar sucursal:", error);
    res.status(500).json({ message: "Error al actualizar sucursal" });
  }
};


// Eliminar sucursal

export const deleteSucursal = async (req, res) => {
  try {
    const { idSucursal } = req.params;
    await db.query("DELETE FROM sucursales WHERE idSucursal = ?", [idSucursal]);
    res.json({ message: "Sucursal eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar sucursal:", error);
    res.status(500).json({ message: "Error al eliminar sucursal" });
  }
};

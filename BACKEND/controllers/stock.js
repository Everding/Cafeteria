import db from "../config/dataBase.js";


// Obtener todo el stock (relación producto-materia)

export const getAllStock = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.id_stock, s.cantidad_necesaria,
             p.nombre AS producto,
             m.nombre AS materia
      FROM stock s
      LEFT JOIN productos p ON s.id_producto = p.id_producto
      LEFT JOIN materiaprima m ON s.id_materia = m.id_materia
      ORDER BY p.nombre ASC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener stock:", error);
    res.status(500).json({ message: "Error al obtener stock" });
  }
};


// Obtener stock por ID

export const getStockById = async (req, res) => {
  try {
    const { id_stock } = req.params;
    const [rows] = await db.query(`
      SELECT s.id_stock, s.cantidad_necesaria,
             p.nombre AS producto,
             m.nombre AS materia
      FROM stock s
      LEFT JOIN productos p ON s.id_producto = p.id_producto
      LEFT JOIN materiaprima m ON s.id_materia = m.id_materia
      WHERE s.id_stock = ?
    `, [id_stock]);

    if (!rows.length) return res.status(404).json({ message: "Registro de stock no encontrado" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener stock:", error);
    res.status(500).json({ message: "Error al obtener stock" });
  }
};


// Crear nuevo registro de stock

export const createStock = async (req, res) => {
  try {
    const { id_producto, id_materia, cantidad_necesaria } = req.body;

    if (!id_producto || !id_materia || cantidad_necesaria == null) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await db.query(`
      INSERT INTO stock (id_producto, id_materia, cantidad_necesaria)
      VALUES (?, ?, ?)
    `, [id_producto, id_materia, cantidad_necesaria]);

    res.status(201).json({ message: "Registro de stock creado", id_stock: result.insertId });
  } catch (error) {
    console.error("Error al crear stock:", error);
    res.status(500).json({ message: "Error al crear stock" });
  }
};


// Actualizar registro de stock

export const updateStock = async (req, res) => {
  try {
    const { id_stock } = req.params;
    const { id_producto, id_materia, cantidad_necesaria } = req.body;

    await db.query(`
      UPDATE stock
      SET id_producto = ?, id_materia = ?, cantidad_necesaria = ?
      WHERE id_stock = ?
    `, [id_producto, id_materia, cantidad_necesaria, id_stock]);

    res.json({ message: "Registro de stock actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar stock:", error);
    res.status(500).json({ message: "Error al actualizar stock" });
  }
};


// Eliminar registro de stock

export const deleteStock = async (req, res) => {
  try {
    const { id_stock } = req.params;
    await db.query("DELETE FROM stock WHERE id_stock = ?", [id_stock]);
    res.json({ message: "Registro de stock eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar stock:", error);
    res.status(500).json({ message: "Error al eliminar stock" });
  }
};

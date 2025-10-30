import db from "../config/dataBase.js";


// Obtener todas las compras (historial)

export const getAllCompras = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.id_compra, p.nombre AS proveedor, c.fecha_compra, c.total
      FROM compras c
      INNER JOIN proveedores p ON c.id_proveedor = p.id_proveedor
      ORDER BY c.fecha_compra DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener las compras:", error);
    res.status(500).json({ message: "Error al obtener las compras" });
  }
};


// Obtener una compra por ID

export const getCompraById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `
      SELECT c.id_compra, p.nombre AS proveedor, c.fecha_compra, c.total
      FROM compras c
      INNER JOIN proveedores p ON c.id_proveedor = p.id_proveedor
      WHERE c.id_compra = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener la compra:", error);
    res.status(500).json({ message: "Error al obtener la compra" });
  }
};


// Registrar una nueva compra
// Ejemplo body: { "id_proveedor": 1, "total": 3500.50 }
export const createCompra = async (req, res) => {
  try {
    const { id_proveedor, total } = req.body;

    if (!id_proveedor || !total) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    await db.query(
      "INSERT INTO compras (id_proveedor, fecha_compra, total) VALUES (?, NOW(), ?)",
      [id_proveedor, total]
    );

    res.status(201).json({ message: "Compra registrada correctamente" });
  } catch (error) {
    console.error("Error al registrar la compra:", error);
    res.status(500).json({ message: "Error al registrar la compra" });
  }
};


// Actualizar una compra (por ejemplo, si se corrigió el total o proveedor)

export const updateCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_proveedor, total } = req.body;

    await db.query(
      "UPDATE compras SET id_proveedor = ?, total = ? WHERE id_compra = ?",
      [id_proveedor, total, id]
    );

    res.json({ message: "Compra actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar la compra:", error);
    res.status(500).json({ message: "Error al actualizar la compra" });
  }
};


// Eliminar una compra del historial
export const deleteCompra = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM compras WHERE id_compra = ?", [id]);

    res.json({ message: "Compra eliminada correctamente del historial" });
  } catch (error) {
    console.error("Error al eliminar la compra:", error);
    res.status(500).json({ message: "Error al eliminar la compra" });
  }
};

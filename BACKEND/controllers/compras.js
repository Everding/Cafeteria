// controllers/comprasController.js
import db from "../config/dataBase.js";

/**
 * Nota: este controller acepta en el body:
 * {
 *   id_proveedor,
 *   fecha  (o fecha_compra)  // string "YYYY-MM-DD"
 *   total
 *   materiasPrimas: [
 *     { id_materia, cantidad, precio_unitario }
 *   ]
 * }
 */

// ----------------------------
// Obtener todas las compras
// ----------------------------
export const getAllCompras = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id_compra,
        p.nombre AS proveedor,
        DATE_FORMAT(c.fecha_compra, '%Y-%m-%d') AS fecha_compra,
        c.total,
        (
          SELECT GROUP_CONCAT(CONCAT(m.nombre, ' (', ci.cantidad, ')') SEPARATOR ', ')
          FROM compra_items ci
          INNER JOIN materiaprima m ON ci.id_materia = m.id_materia
          WHERE ci.id_compra = c.id_compra
        ) AS items
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

// ----------------------------
// Obtener compra por ID
// ----------------------------
export const getCompraById = async (req, res) => {
  try {
    const { id } = req.params;

    const [compraRows] = await db.query(
      `SELECT c.id_compra, c.id_proveedor, p.nombre AS proveedor,
              DATE_FORMAT(c.fecha_compra, '%Y-%m-%d') AS fecha_compra, c.total
       FROM compras c
       LEFT JOIN proveedores p ON c.id_proveedor = p.id_proveedor
       WHERE c.id_compra = ?`,
      [id]
    );

    if (!compraRows.length) return res.status(404).json({ message: "Compra no encontrada" });

    const compra = compraRows[0];

    const [items] = await db.query(
      `SELECT ci.id_item, ci.id_materia, m.nombre AS nombre_materia, ci.cantidad,
              ci.precio_unitario, ci.subtotal
       FROM compra_items ci
       LEFT JOIN materiaprima m ON ci.id_materia = m.id_materia
       WHERE ci.id_compra = ?`,
      [id]
    );

    compra.items = items;

    res.json(compra);
  } catch (error) {
    console.error("Error al obtener la compra:", error);
    res.status(500).json({ message: "Error al obtener la compra" });
  }
};

// ----------------------------
// Crear compra (SIN pool)
// ----------------------------
export const createCompra = async (req, res) => {
  try {
    const { id_proveedor, fecha, total, materiasPrimas } = req.body;

    if (!materiasPrimas || materiasPrimas.length === 0)
      return res.status(400).json({ error: "No hay materias primas en la compra" });

    // Iniciar transacción
    await db.query("START TRANSACTION");

    const [compraResult] = await db.query(
      `INSERT INTO compras (id_proveedor, fecha_compra, total)
       VALUES (?, ?, ?)`,
      [id_proveedor, fecha, total]
    );

    const id_compra = compraResult.insertId;

    for (const item of materiasPrimas) {
      const subtotal = item.cantidad * item.precio_unitario;

      await db.query(
        `INSERT INTO compra_items 
         (id_compra, id_materia, cantidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [id_compra, item.id_materia, item.cantidad, item.precio_unitario, subtotal]
      );

      await db.query(
        `UPDATE materiaprima
         SET stock_actual = stock_actual + ?
         WHERE id_materia = ?`,
        [item.cantidad, item.id_materia]
      );
    }

    await db.query("COMMIT");

    res.json({ message: "Compra registrada correctamente", id_compra });

  } catch (error) {
    console.error("Error en createCompra:", error);
    await db.query("ROLLBACK");
    res.status(500).json({ error: "Error registrando compra" });
  }
};

// ----------------------------
// Actualizar compra (SIN pool)
// ----------------------------
export const updateCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_proveedor, fecha, fecha_compra, total, materiasPrimas } = req.body;

    const fechaFinal = fecha || fecha_compra;

    await db.query("START TRANSACTION");

    // Verificar existencia
    const [exist] = await db.query(`SELECT * FROM compras WHERE id_compra = ?`, [id]);
    if (!exist.length) {
      await db.query("ROLLBACK");
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    // Obtener items previos
    const [itemsPrevios] = await db.query(
      `SELECT id_materia, cantidad FROM compra_items WHERE id_compra = ?`,
      [id]
    );

    // Revertir stock
    for (const item of itemsPrevios) {
      await db.query(
        `UPDATE materiaprima SET stock_actual = stock_actual - ? WHERE id_materia = ?`,
        [item.cantidad, item.id_materia]
      );
    }

    // Actualizar datos principales
    await db.query(
      `UPDATE compras 
       SET id_proveedor = ?, fecha_compra = ?, total = ?
       WHERE id_compra = ?`,
      [id_proveedor, fechaFinal, total, id]
    );

    // Borrar items antiguos
    await db.query(`DELETE FROM compra_items WHERE id_compra = ?`, [id]);

    // Insertar nuevos items
    for (const it of materiasPrimas) {
      const subtotal = it.cantidad * it.precio_unitario;

      await db.query(
        `INSERT INTO compra_items
         (id_compra, id_materia, cantidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [id, it.id_materia, it.cantidad, it.precio_unitario, subtotal]
      );

      await db.query(
        `UPDATE materiaprima SET stock_actual = stock_actual + ? WHERE id_materia = ?`,
        [it.cantidad, it.id_materia]
      );
    }

    await db.query("COMMIT");

    res.json({ message: "Compra actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar compra:", error);
    await db.query("ROLLBACK");
    res.status(500).json({ message: "Error al actualizar la compra" });
  }
};

// ----------------------------
// Eliminar compra (SIN pool)
// ----------------------------
export const deleteCompra = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("START TRANSACTION");

    const [exist] = await db.query(`SELECT * FROM compras WHERE id_compra = ?`, [id]);
    if (!exist.length) {
      await db.query("ROLLBACK");
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    const [items] = await db.query(
      `SELECT id_materia, cantidad FROM compra_items WHERE id_compra = ?`,
      [id]
    );

    // Revertir stock
    for (const item of items) {
      await db.query(
        `UPDATE materiaprima SET stock_actual = stock_actual - ? WHERE id_materia = ?`,
        [item.cantidad, item.id_materia]
      );
    }

    // Borrar items y compra
    await db.query(`DELETE FROM compra_items WHERE id_compra = ?`, [id]);
    await db.query(`DELETE FROM compras WHERE id_compra = ?`, [id]);

    await db.query("COMMIT");

    res.json({ message: "Compra eliminada y stock revertido" });
  } catch (error) {
    console.error("Error al eliminar compra:", error);
    await db.query("ROLLBACK");
    res.status(500).json({ message: "Error al eliminar compra" });
  }
};

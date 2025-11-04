import db from "../config/dataBase.js";

// ================================================
// Obtener todos los detalles de un carrito
// ================================================
export const getDetalleCarritoByCarrito = async (req, res) => {
  try {
    const { id_carrito } = req.params;

   const [rows] = await db.query(`
  SELECT 
    dc.id_detalle,
    dc.id_carrito,
    dc.id_producto,
    p.nombre AS nombre_producto,
    dc.id_menu_prefabricado,
    m.nombre AS nombre_menu,
    dc.cantidad,
    dc.subtotal
  FROM detallecarrito dc
  LEFT JOIN productos p ON dc.id_producto = p.id_producto
  LEFT JOIN menusprefabricados m ON dc.id_menu_prefabricado = m.id_menu
  WHERE dc.id_carrito = ?
`, [id_carrito]);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener detalle del carrito:", error);
    res.status(500).json({ message: "Error al obtener detalle del carrito" });
  }
};

// ================================================
// Agregar un producto o menú al carrito
// ================================================
export const addDetalleCarrito = async (req, res) => {
  try {
    const { id_carrito, id_producto, id_menu_fabricado, cantidad, subtotal } = req.body;

    if (!id_carrito || (!id_producto && !id_menu_fabricado) || !cantidad || !subtotal) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await db.query(`
      INSERT INTO detallecarrito (id_carrito, id_producto, id_menu_fabricado, cantidad, subtotal)
      VALUES (?, ?, ?, ?, ?)
    `, [id_carrito, id_producto || null, id_menu_fabricado || null, cantidad, subtotal]);

    res.status(201).json({ message: "Detalle agregado al carrito", id_detalle: result.insertId });
  } catch (error) {
    console.error("Error al agregar detalle al carrito:", error);
    res.status(500).json({ message: "Error al agregar detalle al carrito" });
  }
};

// ================================================
// Actualizar un detalle del carrito
// ================================================
export const updateDetalleCarrito = async (req, res) => {
  try {
    const { id_detalle } = req.params;
    const { cantidad, subtotal } = req.body;

    await db.query(`
      UPDATE detallecarrito
      SET cantidad = ?, subtotal = ?
      WHERE id_detalle = ?
    `, [cantidad, subtotal, id_detalle]);

    res.json({ message: "Detalle del carrito actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar detalle del carrito:", error);
    res.status(500).json({ message: "Error al actualizar detalle del carrito" });
  }
};

// ================================================
// Eliminar un detalle del carrito
// ================================================
export const deleteDetalleCarrito = async (req, res) => {
  try {
    const { id_detalle } = req.params;
    await db.query("DELETE FROM detallecarrito WHERE id_detalle = ?", [id_detalle]);
    res.json({ message: "Detalle del carrito eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar detalle del carrito:", error);
    res.status(500).json({ message: "Error al eliminar detalle del carrito" });
  }
};

// ================================================
// Limpiar todos los detalles de un carrito
// ================================================
export const deleteDetallesByCarrito = async (req, res) => {
  try {
    const { id_carrito } = req.params;
    await db.query("DELETE FROM detallecarrito WHERE id_carrito = ?", [id_carrito]);
    res.json({ message: "Carrito limpiado correctamente" });
  } catch (error) {
    console.error("Error al limpiar carrito:", error);
    res.status(500).json({ message: "Error al limpiar carrito" });
  }
};

// ===============================
// Obtener cantidad total de productos en el carrito
// ===============================


export const getCantidadCarrito = async (req, res) => {
  try {
    const { id_carrito } = req.params; // o id_usuario si preferís
    const [rows] = await db.query(
      `SELECT COALESCE(SUM(cantidad), 0) AS totalProductos
       FROM detallecarrito
       WHERE id_carrito = ?`,
      [id_carrito]
    );

    res.json({ total: rows[0].totalProductos || 0 });
  } catch (error) {
    console.error("Error al obtener cantidad del carrito:", error);
    res.status(500).json({ error: "Error al obtener cantidad del carrito" });
  }
};
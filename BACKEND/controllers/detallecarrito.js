import db from "../config/dataBase.js";


// Obtener todos los detalles de un carrito

export const getDetalleCarritoByCarrito = async (req, res) => {
  try {
    const { id_carrito } = req.params;

    const [rows] = await db.query(`
      SELECT dc.id_detalle, dc.id_carrito, dc.id_producto, p.nombre AS nombre_producto,
             dc.id_menu_prefabricado, m.nombre AS nombre_menu,
             dc.cantidad, dc.subtotal
      FROM detalle_carrito dc
      LEFT JOIN productos p ON dc.id_producto = p.id_producto
      LEFT JOIN menus_prefabricados m ON dc.id_menu_prefabricado = m.id_menu
      WHERE dc.id_carrito = ?
    `, [id_carrito]);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener detalle del carrito:", error);
    res.status(500).json({ message: "Error al obtener detalle del carrito" });
  }
};

// Agregar un producto o menú al carrito

export const addDetalleCarrito = async (req, res) => {
  try {
    const { id_carrito, id_producto, id_menu_prefabricado, cantidad, subtotal } = req.body;

    if (!id_carrito || (!id_producto && !id_menu_prefabricado) || !cantidad || !subtotal) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await db.query(`
      INSERT INTO detalle_carrito (id_carrito, id_producto, id_menu_prefabricado, cantidad, subtotal)
      VALUES (?, ?, ?, ?, ?)
    `, [id_carrito, id_producto || null, id_menu_prefabricado || null, cantidad, subtotal]);

    res.status(201).json({ message: "Detalle agregado al carrito", id_detalle: result.insertId });
  } catch (error) {
    console.error("Error al agregar detalle al carrito:", error);
    res.status(500).json({ message: "Error al agregar detalle al carrito" });
  }
};


// Actualizar un detalle del carrito

export const updateDetalleCarrito = async (req, res) => {
  try {
    const { id_detalle } = req.params;
    const { cantidad, subtotal } = req.body;

    await db.query(`
      UPDATE detalle_carrito
      SET cantidad = ?, subtotal = ?
      WHERE id_detalle = ?
    `, [cantidad, subtotal, id_detalle]);

    res.json({ message: "Detalle del carrito actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar detalle del carrito:", error);
    res.status(500).json({ message: "Error al actualizar detalle del carrito" });
  }
};


// Eliminar un detalle del carrito

export const deleteDetalleCarrito = async (req, res) => {
  try {
    const { id_detalle } = req.params;
    await db.query("DELETE FROM detalle_carrito WHERE id_detalle = ?", [id_detalle]);
    res.json({ message: "Detalle del carrito eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar detalle del carrito:", error);
    res.status(500).json({ message: "Error al eliminar detalle del carrito" });
  }
};

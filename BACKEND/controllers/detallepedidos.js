import db from "../config/dataBase.js";

// Obtener todos los detalles de un pedido

export const getDetallePedidoByPedido = async (req, res) => {
  try {
    const { idPedido } = req.params;

    const [rows] = await db.query(`
      SELECT dp.idDetalle, dp.idPedido, dp.id_producto, p.nombre AS nombre_producto,
             dp.id_menuprefabricado, m.nombre AS nombre_menu,
             dp.cantidad, dp.subtotal
      FROM detalle_pedidos dp
      LEFT JOIN productos p ON dp.id_producto = p.id_producto
      LEFT JOIN menus_prefabricados m ON dp.id_menuprefabricado = m.id_menu
      WHERE dp.idPedido = ?
    `, [idPedido]);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener detalle del pedido:", error);
    res.status(500).json({ message: "Error al obtener detalle del pedido" });
  }
};


// Agregar un producto o menú al pedido

export const addDetallePedido = async (req, res) => {
  try {
    const { idPedido, id_producto, id_menuprefabricado, cantidad, subtotal } = req.body;

    if (!idPedido || (!id_producto && !id_menuprefabricado) || !cantidad || !subtotal) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await db.query(`
      INSERT INTO detalle_pedidos (idPedido, id_producto, id_menuprefabricado, cantidad, subtotal)
      VALUES (?, ?, ?, ?, ?)
    `, [idPedido, id_producto || null, id_menuprefabricado || null, cantidad, subtotal]);

    res.status(201).json({ message: "Detalle agregado al pedido", idDetalle: result.insertId });
  } catch (error) {
    console.error("Error al agregar detalle al pedido:", error);
    res.status(500).json({ message: "Error al agregar detalle al pedido" });
  }
};


// Actualizar un detalle del pedido

export const updateDetallePedido = async (req, res) => {
  try {
    const { idDetalle } = req.params;
    const { cantidad, subtotal } = req.body;

    await db.query(`
      UPDATE detalle_pedidos
      SET cantidad = ?, subtotal = ?
      WHERE idDetalle = ?
    `, [cantidad, subtotal, idDetalle]);

    res.json({ message: "Detalle del pedido actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar detalle del pedido:", error);
    res.status(500).json({ message: "Error al actualizar detalle del pedido" });
  }
};


// Eliminar un detalle del pedido

export const deleteDetallePedido = async (req, res) => {
  try {
    const { idDetalle } = req.params;
    await db.query("DELETE FROM detalle_pedidos WHERE idDetalle = ?", [idDetalle]);
    res.json({ message: "Detalle del pedido eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar detalle del pedido:", error);
    res.status(500).json({ message: "Error al eliminar detalle del pedido" });
  }
};

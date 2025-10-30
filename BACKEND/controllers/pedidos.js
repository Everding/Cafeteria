import db from "../config/dataBase.js";


// Obtener todos los pedidos

export const getAllPedidos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.idPedido, p.id_cliente, c.NumeroMesa AS nombre_cliente,
             p.id_usuario_app, u.usuario AS usuario_app,
             p.id_sucursal, s.nombre AS nombre_sucursal,
             p.fecha_pedido, p.total, p.estado
      FROM pedidos p
      LEFT JOIN clientes c ON p.id_cliente = c.idCliente
      LEFT JOIN usuariosApp u ON p.id_usuario_app = u.id_usuario
      LEFT JOIN sucursales s ON p.id_sucursal = s.id_sucursal
      ORDER BY p.fecha_pedido DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};


// Obtener pedido por ID

export const getPedidoById = async (req, res) => {
  try {
    const { idPedido } = req.params;

    const [rows] = await db.query(`
      SELECT p.idPedido, p.id_cliente, c.NumeroMesa AS nombre_cliente,
             p.id_usuario_app, u.usuario AS usuario_app,
             p.id_sucursal, s.nombre AS nombre_sucursal,
             p.fecha_pedido, p.total, p.estado
      FROM pedidos p
      LEFT JOIN clientes c ON p.id_cliente = c.idCliente
      LEFT JOIN usuariosApp u ON p.id_usuario_app = u.id_usuario
      LEFT JOIN sucursales s ON p.id_sucursal = s.id_sucursal
      WHERE p.idPedido = ?
    `, [idPedido]);

    if (!rows.length) return res.status(404).json({ message: "Pedido no encontrado" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener pedido:", error);
    res.status(500).json({ message: "Error al obtener pedido" });
  }
};


// Crear un nuevo pedido

export const createPedido = async (req, res) => {
  try {
    const { id_cliente, id_usuario_app, id_sucursal, total, estado } = req.body;

    if ((!id_cliente && !id_usuario_app) || !id_sucursal || total == null || !estado) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await db.query(`
      INSERT INTO pedidos (id_cliente, id_usuario_app, id_sucursal, fecha_pedido, total, estado)
      VALUES (?, ?, ?, NOW(), ?, ?)
    `, [id_cliente || null, id_usuario_app || null, id_sucursal, total, estado]);

    res.status(201).json({ message: "Pedido creado", idPedido: result.insertId });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(500).json({ message: "Error al crear pedido" });
  }
};


// Actualizar un pedido

export const updatePedido = async (req, res) => {
  try {
    const { idPedido } = req.params;
    const { total, estado } = req.body;

    await db.query(`
      UPDATE pedidos
      SET total = ?, estado = ?
      WHERE idPedido = ?
    `, [total, estado, idPedido]);

    res.json({ message: "Pedido actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    res.status(500).json({ message: "Error al actualizar pedido" });
  }
};


// Eliminar un pedido

export const deletePedido = async (req, res) => {
  try {
    const { idPedido } = req.params;
    await db.query("DELETE FROM pedidos WHERE idPedido = ?", [idPedido]);
    res.json({ message: "Pedido eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
    res.status(500).json({ message: "Error al eliminar pedido" });
  }
};

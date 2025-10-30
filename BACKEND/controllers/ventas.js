import db from "../config/dataBase.js";


// Obtener todas las ventas

export const getAllVentas = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT v.idVenta, v.fecha_venta, v.total,
             p.idPedido, c.NumeroMesa AS cliente, u.usuario AS usuario_app,
             m.tipo AS metodo_pago
      FROM ventas v
      LEFT JOIN pedidos p ON v.idPedido = p.idPedido
      LEFT JOIN clientes c ON p.id_cliente = c.idCliente
      LEFT JOIN usuariosApp u ON p.id_usuario_app = u.id_usuario
      LEFT JOIN metodos_pago m ON v.id_metodo_pago = m.id_metodo_pago
      ORDER BY v.fecha_venta DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    res.status(500).json({ message: "Error al obtener ventas" });
  }
};


// Obtener venta por ID

export const getVentaById = async (req, res) => {
  try {
    const { idVenta } = req.params;
    const [rows] = await db.query(`
      SELECT v.idVenta, v.fecha_venta, v.total,
             p.idPedido, c.NumeroMesa AS cliente, u.usuario AS usuario_app,
             m.tipo AS metodo_pago
      FROM ventas v
      LEFT JOIN pedidos p ON v.idPedido = p.idPedido
      LEFT JOIN clientes c ON p.id_cliente = c.idCliente
      LEFT JOIN usuariosApp u ON p.id_usuario_app = u.id_usuario
      LEFT JOIN metodos_pago m ON v.id_metodo_pago = m.id_metodo_pago
      WHERE v.idVenta = ?
    `, [idVenta]);

    if (!rows.length) return res.status(404).json({ message: "Venta no encontrada" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener venta:", error);
    res.status(500).json({ message: "Error al obtener venta" });
  }
};


// Crear nueva venta

export const createVenta = async (req, res) => {
  try {
    const { idPedido, id_metodo_pago, total } = req.body;

    if (!idPedido || !id_metodo_pago || total == null) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await db.query(`
      INSERT INTO ventas (idPedido, id_metodo_pago, fecha_venta, total)
      VALUES (?, ?, NOW(), ?)
    `, [idPedido, id_metodo_pago, total]);

    res.status(201).json({ message: "Venta registrada", idVenta: result.insertId });
  } catch (error) {
    console.error("Error al crear venta:", error);
    res.status(500).json({ message: "Error al crear venta" });
  }
};


// Actualizar venta

export const updateVenta = async (req, res) => {
  try {
    const { idVenta } = req.params;
    const { idPedido, id_metodo_pago, total } = req.body;

    await db.query(`
      UPDATE ventas
      SET idPedido = ?, id_metodo_pago = ?, total = ?
      WHERE idVenta = ?
    `, [idPedido, id_metodo_pago, total, idVenta]);

    res.json({ message: "Venta actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar venta:", error);
    res.status(500).json({ message: "Error al actualizar venta" });
  }
};


// Eliminar venta

export const deleteVenta = async (req, res) => {
  try {
    const { idVenta } = req.params;
    await db.query("DELETE FROM ventas WHERE idVenta = ?", [idVenta]);
    res.json({ message: "Venta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar venta:", error);
    res.status(500).json({ message: "Error al eliminar venta" });
  }
};

import db from "../config/dataBase.js";


// Obtener todos los pedidos

export const getAllPedidos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.idPedido,
        p.id_usuario_app,
        u.usuario,
        u.imagen_url AS foto,
        p.estado,
        dp.id_producto,
        prod.nombre AS nombre_producto,
        dp.cantidad
      FROM pedidos p
      LEFT JOIN usuariosApp u ON p.id_usuario_app = u.idUsuarioApp
      LEFT JOIN detallepedidos dp ON p.idPedido = dp.idPedido
      LEFT JOIN productos prod ON dp.id_producto = prod.id_producto
      ORDER BY p.idPedido DESC
    `);

    // Agrupamos productos por pedido
    const pedidosMap = new Map();

    rows.forEach(row => {
      if (!pedidosMap.has(row.idPedido)) {
        pedidosMap.set(row.idPedido, {
          idPedido: row.idPedido,
          usuario: row.usuario,
          foto: row.foto,
          estado: row.estado,
          productos: []
        });
      }
      if (row.id_producto) {
        pedidosMap.get(row.idPedido).productos.push({
          nombre: row.nombre_producto,
          cantidad: row.cantidad
        });
      }
    });

    const pedidos = Array.from(pedidosMap.values());

    res.json(pedidos);
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
  const { id_cliente, id_usuario_app, id_sucursal, total, estado, carritoItems, id_metodo_pago } = req.body;

  if ((!id_cliente && !id_usuario_app) || !id_sucursal || total == null || !estado || !Array.isArray(carritoItems) || carritoItems.length === 0) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  let connection;
  try {
    // Obtener conexión del pool
    connection = await db.getConnection ? await db.getConnection() : db;
    await connection.beginTransaction?.();

    // 1️⃣ Crear pedido
    const [pedidoResult] = await connection.query(
      `INSERT INTO pedidos (id_cliente, id_usuario_app, id_sucursal, fecha_pedido, total, estado)
       VALUES (?, ?, ?, NOW(), ?, ?)`,
      [id_cliente || null, id_usuario_app || null, id_sucursal, total, estado]
    );
    const idPedido = pedidoResult.insertId;

    // 2️⃣ Guardar detalle de cada item y reducir materia prima
    for (let item of carritoItems) {
      const { id_producto, id_menu_prefabricado, cantidad, precio_actual } = item;
      const subtotal = cantidad * precio_actual;

      if (id_producto) {
        // Guardar detalle pedido
        await connection.query(
          "INSERT INTO detallepedidos (idPedido, id_producto, cantidad, subtotal) VALUES (?, ?, ?, ?)",
          [idPedido, id_producto, cantidad, subtotal]
        );

        // Reducir stock de materias primas asociadas al producto
        const [materias] = await connection.query(
          `SELECT s.id_materia, s.cantidad_necesaria, m.stock_actual
           FROM stock s
           JOIN materiaprima m ON s.id_materia = m.id_materia
           WHERE s.id_producto = ?`,
          [id_producto]
        );

        for (let mat of materias) {
          const nuevoStock = mat.stock_actual - mat.cantidad_necesaria * cantidad;
          if (nuevoStock < 0) throw new Error(`No hay suficiente stock de ${mat.id_materia}`);
          await connection.query(
            `UPDATE materiaprima SET stock_actual = ? WHERE id_materia = ?`,
            [nuevoStock, mat.id_materia]
          );
        }
      }

      if (id_menu_prefabricado) {
        // Guardar detalle pedido (si manejas menus prefabricados)
        await connection.query(
          "INSERT INTO detallepedidos (idPedido, id_menu_prefabricado, cantidad, subtotal) VALUES (?, ?, ?, ?)",
          [idPedido, id_menu_prefabricado, cantidad, subtotal]
        );

        // 🔹 Aquí podrías agregar reducción de materias primas si los menús tienen stock definido
      }
    }

    // 3️⃣ Registrar venta
    await connection.query(
      "INSERT INTO ventas (idPedido, id_metodo_pago, total, fecha_venta) VALUES (?, ?, ?, NOW())",
      [idPedido, id_metodo_pago || null, total]
    );

    // 4️⃣ Vaciar carrito
    if (id_usuario_app) {
      await connection.query(
        "DELETE FROM detallecarrito WHERE id_carrito = (SELECT id_carrito FROM carrito WHERE id_usuario_app = ? AND activo = true)",
        [id_usuario_app]
      );
    }

    await connection.commit?.();
    res.status(201).json({ message: "Pedido y venta registrados correctamente, stock actualizado", idPedido });
  } catch (error) {
    await connection.rollback?.();
    console.error("Error al crear pedido:", error);
    res.status(500).json({ message: "Error al crear pedido", error: error.message });
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

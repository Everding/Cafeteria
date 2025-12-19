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
        p.id_cliente,
        p.estado,
        p.fecha_pedido,     -- ✔️ AGREGADO
        dp.id_producto,
        prod.nombre AS nombre_producto,
        dp.cantidad
      FROM pedidos p
      LEFT JOIN usuariosApp u ON p.id_usuario_app = u.idUsuarioApp
      LEFT JOIN detallepedidos dp ON p.idPedido = dp.idPedido
      LEFT JOIN productos prod ON dp.id_producto = prod.id_producto
      ORDER BY p.idPedido DESC
    `);

    const pedidosMap = new Map();

    rows.forEach(row => {
      if (!pedidosMap.has(row.idPedido)) {
        pedidosMap.set(row.idPedido, {
          idPedido: row.idPedido,
          usuario: row.usuario,
          foto: row.foto,
          id_cliente: row.id_cliente,
          estado: row.estado,
          fecha_pedido: row.fecha_pedido,   // ✔️ AGREGADO
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

// Crear un nuevo pedido (AHORA ES INDEPENDIENTE DE req/res → funciona perfecto desde la ruta)
// Crear un nuevo pedido (AHORA ES INDEPENDIENTE DE req/res → funciona perfecto desde la ruta)
export const createPedido = async ({
  carritoItems,
  id_usuario_app = null,
  id_cliente = null,
  id_sucursal,
  total,
  estado = "Pendiente",
  id_metodo_pago = null
} = {}) => {
  // Validación temprana
  if (!id_sucursal || total == null || !estado || !Array.isArray(carritoItems) || carritoItems.length === 0) {
    throw new Error("Faltan datos obligatorios para crear el pedido");
  }

  if (!id_usuario_app && !id_cliente) {
    throw new Error("Debe proporcionar id_usuario_app o id_cliente");
  }

  let connection;
  try {
    connection = await db.getConnection?.() || db;
    await connection.beginTransaction?.();

    // 1. Crear el pedido
    const [pedidoResult] = await connection.query(
      `INSERT INTO pedidos (id_cliente, id_usuario_app, id_sucursal, fecha_pedido, total, estado)
       VALUES (?, ?, ?, NOW(), ?, ?)`,
      [id_cliente, id_usuario_app, id_sucursal, total, estado]
    );
    const idPedido = pedidoResult.insertId;

    // 2. Procesar cada ítem del carrito
    for (const item of carritoItems) {
      const { id_producto, id_menu_prefabricado, cantidad = 1, precio_actual } = item;
      const subtotal = Number(cantidad) * Number(precio_actual);

      if (!id_producto && !id_menu_prefabricado) {
        throw new Error("Cada item debe tener id_producto o id_menu_prefabricado");
      }

      if (id_producto) {
        await connection.query(
          "INSERT INTO detallepedidos (idPedido, id_producto, cantidad, subtotal) VALUES (?, ?, ?, ?)",
          [idPedido, id_producto, cantidad, subtotal]
        );

        // Reducir stock de materias primas
        const [materias] = await connection.query(
          `SELECT s.id_materia, s.cantidad_necesaria, m.stock_actual
           FROM stock s
           JOIN materiaprima m ON s.id_materia = m.id_materia
           WHERE s.id_producto = ?`,
          [id_producto]
        );

        for (const mat of materias) {
          const nuevoStock = mat.stock_actual - (mat.cantidad_necesaria * cantidad);
          if (nuevoStock < 0) {
            throw new Error(`Stock insuficiente para materia prima ID: ${mat.id_materia}`);
          }
          await connection.query(
            `UPDATE materiaprima SET stock_actual = ? WHERE id_materia = ?`,
            [nuevoStock, mat.id_materia]
          );
        }
      }

      if (id_menu_prefabricado) {
        await connection.query(
          "INSERT INTO detallepedidos (idPedido, id_menu_prefabricado, cantidad, subtotal) VALUES (?, ?, ?, ?)",
          [idPedido, id_menu_prefabricado, cantidad, subtotal]
        );
        // Aquí puedes agregar lógica para menús prefabricados si tenés stock asociado
      }
    }

    // 3. Registrar venta
    await connection.query(
      "INSERT INTO ventas (idPedido, id_metodo_pago, total, fecha_venta) VALUES (?, ?, ?, NOW())",
      [idPedido, id_metodo_pago, total]
    );

    // 4. Vaciar carrito del usuario app (si aplica)
    if (id_usuario_app) {
      await connection.query(
        `DELETE dc FROM detallecarrito dc
         INNER JOIN carrito c ON dc.id_carrito = c.id_carrito
         WHERE c.id_usuario_app = ? AND c.activo = true`,
        [id_usuario_app]
      );
    }

    await connection.commit?.();

    return {
      success: true,
      idPedido,
      message: "Pedido creado correctamente"
    };

    } catch (error) {
    if (connection) await connection.rollback?.();
    console.error("Error en createPedido:", error);
    throw error;
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
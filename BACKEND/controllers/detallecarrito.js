import db from "../config/dataBase.js";

// ================================================
// Obtener carrito activo del usuario o cliente
// ================================================
const obtenerCarritoActivo = async (req) => {
  const { tipo, id } = req.user;

  let idUsuarioApp = tipo === "usuariosapp" ? id : null;
  let idCliente = tipo === "clientes" ? id : null;

  if (!idUsuarioApp && !idCliente) {
    throw new Error("Solo clientes o usuarios app pueden tener carritos.");
  }

  const idSucursalPorDefecto = 1;

  // Buscar carrito activo existente
  const [carritos] = await db.query(
    `SELECT * FROM carrito 
     WHERE (id_usuario_app = ? OR id_cliente = ?) 
     AND activo = TRUE`,
    [idUsuarioApp, idCliente]
  );

  if (carritos.length > 0) return carritos[0];

  // Crear carrito nuevo si no existe
  const [result] = await db.query(
    `INSERT INTO carrito (id_usuario_app, id_cliente, id_sucursal, fecha_creacion, activo)
     VALUES (?, ?, ?, NOW(), TRUE)`,
    [idUsuarioApp, idCliente, idSucursalPorDefecto]
  );

  return {
    id_carrito: result.insertId,
    id_usuario_app: idUsuarioApp,
    id_cliente: idCliente,
    id_sucursal: idSucursalPorDefecto,
    activo: true,
  };
};

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
    res.status(500).json({ message: "Error al obtener detalle del carrito", error: error.message });
  }
};

// ================================================
// Agregar un producto o menú al carrito
// ================================================
export const addDetalleCarrito = async (req, res) => {
  try {
    const { id_producto, id_menu_prefabricado, cantidad, subtotal } = req.body;

    if ((!id_producto && !id_menu_prefabricado) || !cantidad || !subtotal) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Obtener o crear carrito activo
    const carrito = await obtenerCarritoActivo(req);
    const id_carrito = carrito.id_carrito;

    const [result] = await db.query(`
      INSERT INTO detallecarrito (id_carrito, id_producto, id_menu_prefabricado, cantidad, subtotal)
      VALUES (?, ?, ?, ?, ?)
    `, [id_carrito, id_producto || null, id_menu_prefabricado || null, cantidad, subtotal]);

    res.status(201).json({ message: "Detalle agregado al carrito", id_detalle: result.insertId, id_carrito });
  } catch (error) {
    console.error("Error al agregar detalle al carrito:", error);
    res.status(500).json({ message: "Error al agregar detalle al carrito", error: error.message });
  }
};

// ================================================
// Actualizar un detalle del carrito
// ================================================
export const updateDetalleCarrito = async (req, res) => {
  try {
    const { id_detalle } = req.params;
    const { cantidad, subtotal } = req.body;

    if (!cantidad || !subtotal) {
      return res.status(400).json({ message: "Cantidad y subtotal son obligatorios" });
    }

    await db.query(`
      UPDATE detallecarrito
      SET cantidad = ?, subtotal = ?
      WHERE id_detalle = ?
    `, [cantidad, subtotal, id_detalle]);

    res.json({ message: "Detalle del carrito actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar detalle del carrito:", error);
    res.status(500).json({ message: "Error al actualizar detalle del carrito", error: error.message });
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
    res.status(500).json({ message: "Error al eliminar detalle del carrito", error: error.message });
  }
};

// ================================================
// Limpiar todos los detalles de un carrito
// ================================================
export const deleteDetallesByCarrito = async (req, res) => {
  try {
    const carrito = await obtenerCarritoActivo(req);
    const id_carrito = carrito.id_carrito;

    await db.query("DELETE FROM detallecarrito WHERE id_carrito = ?", [id_carrito]);
    res.json({ message: "Carrito limpiado correctamente" });
  } catch (error) {
    console.error("Error al limpiar carrito:", error);
    res.status(500).json({ message: "Error al limpiar carrito", error: error.message });
  }
};

// ================================================
// Obtener cantidad total de productos en el carrito
// ================================================
export const getCantidadCarrito = async (req, res) => {
  try {
    const carrito = await obtenerCarritoActivo(req);
    const id_carrito = carrito.id_carrito;

    const [rows] = await db.query(`
      SELECT COALESCE(SUM(cantidad), 0) AS total
      FROM detallecarrito
      WHERE id_carrito = ?
    `, [id_carrito]);

    res.json({ total: Number(rows[0].total) || 0 });
  } catch (error) {
    console.error("Error al obtener cantidad del carrito:", error);
    res.status(500).json({ error: "Error al obtener cantidad del carrito", detalle: error.message });
  }
};

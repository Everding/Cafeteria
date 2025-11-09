import db from "../config/dataBase.js";

// ===============================
// Obtener todos los carritos activos
// ===============================
export const getAllCarritos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id_carrito, 
        c.id_cliente, 
        c.id_usuario_app, 
        c.id_sucursal, 
        c.fecha_creacion, 
        c.activo,
        cl.numeroMesa AS numero_mesa, 
        ua.usuario AS nombre_usuario_app, 
        s.nombreSucursal AS sucursal
      FROM carrito c
      LEFT JOIN Clientes cl ON c.id_cliente = cl.idCliente
      LEFT JOIN UsuariosApp ua ON c.id_usuario_app = ua.idUsuarioApp
      LEFT JOIN Sucursales s ON c.id_sucursal = s.idSucursal
      WHERE c.activo = TRUE
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener carritos:", error);
    res.status(500).json({ message: "Error al obtener carritos" });
  }
};

// ===============================
// Obtener carrito por ID con detalle de productos
// ===============================
export const getCarritoById = async (req, res) => {
  try {
    const { id_carrito } = req.params;

    const [carritoRows] = await db.query(
      `SELECT * FROM carrito WHERE id_carrito = ?`,
      [id_carrito]
    );

    if (!carritoRows.length)
      return res.status(404).json({ message: "Carrito no encontrado" });

    const carrito = carritoRows[0];

    const [detalleRows] = await db.query(
      `SELECT 
         dc.id_detalle,
         dc.id_producto,
         p.nombre AS nombre_producto,
         dc.id_menu_prefabricado,
         m.nombre AS nombre_menu,
         dc.cantidad,
         dc.subtotal
       FROM detallecarrito dc
       LEFT JOIN productos p ON dc.id_producto = p.id_producto
       LEFT JOIN menusprefabricados m ON dc.id_menu_prefabricado = m.id_menu
       WHERE dc.id_carrito = ?`,
      [id_carrito]
    );

    const total = detalleRows.reduce((acc, item) => acc + Number(item.subtotal || 0), 0);

    res.json({ carrito, detalle: detalleRows, total });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ message: "Error al obtener carrito con detalle" });
  }
};

// ===============================
// Crear carrito nuevo (manual)
// ===============================
export const createCarrito = async (req, res) => {
  try {
    const { id_cliente, id_usuario_app, id_sucursal } = req.body;

    if (!id_cliente && !id_usuario_app)
      return res.status(400).json({ message: "Debe indicar id_cliente o id_usuario_app" });

    const [result] = await db.query(
      `INSERT INTO carrito (id_cliente, id_usuario_app, id_sucursal, fecha_creacion, activo)
       VALUES (?, ?, ?, NOW(), TRUE)`,
      [id_cliente || null, id_usuario_app || null, id_sucursal || null]
    );

    res.status(201).json({ message: "Carrito creado", id_carrito: result.insertId });
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ message: "Error al crear carrito" });
  }
};

// ===============================
// Actualizar carrito
// ===============================
export const updateCarrito = async (req, res) => {
  try {
    const { id_carrito } = req.params;
    const { id_sucursal, activo } = req.body;

    await db.query(
      `UPDATE carrito
       SET id_sucursal = ?, activo = ?
       WHERE id_carrito = ?`,
      [id_sucursal || null, activo, id_carrito]
    );

    res.json({ message: "Carrito actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    res.status(500).json({ message: "Error al actualizar carrito" });
  }
};

// ===============================
// Eliminar carrito
// ===============================
export const deleteCarrito = async (req, res) => {
  try {
    const { id_carrito } = req.params;
    await db.query("DELETE FROM carrito WHERE id_carrito = ?", [id_carrito]);
    res.json({ message: "Carrito eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar carrito:", error);
    res.status(500).json({ message: "Error al eliminar carrito" });
  }
};

// ===============================
// Obtener o crear carrito activo
// ===============================
export const getOrCreateCarritoActivo = async (req, res) => {
  try {
    const { tipo, id } = req.user;

    let idUsuarioApp = tipo === "usuariosapp" ? id : null;
    let idCliente = tipo === "clientes" ? id : null;

    if (!idUsuarioApp && !idCliente)
      return res.status(403).json({ message: "Solo clientes o usuarios app pueden tener carritos." });

    const idSucursalPorDefecto = 1;

    // Buscar carrito activo existente
    const [carritoRows] = await db.query(
      `SELECT * FROM carrito 
       WHERE (id_usuario_app = ? OR id_cliente = ?) 
       AND activo = TRUE
       ORDER BY fecha_creacion DESC
       LIMIT 1`,
      [idUsuarioApp, idCliente]
    );

    if (carritoRows.length > 0) return res.json(carritoRows[0]);

    // Crear carrito nuevo si no existe
    const [result] = await db.query(
      `INSERT INTO carrito (id_usuario_app, id_cliente, id_sucursal, fecha_creacion, activo)
       VALUES (?, ?, ?, NOW(), TRUE)`,
      [idUsuarioApp, idCliente, idSucursalPorDefecto]
    );

    const nuevoCarrito = {
      id_carrito: result.insertId,
      id_usuario_app: idUsuarioApp,
      id_cliente: idCliente,
      id_sucursal: idSucursalPorDefecto,
      activo: true,
    };

    res.status(201).json(nuevoCarrito);
  } catch (error) {
    console.error("Error en getOrCreateCarritoActivo:", error);
    res.status(500).json({ message: "Error al obtener o crear carrito activo" });
  }
};

// ===============================
// Obtener cantidad total de productos en carrito activo
// ===============================
export const getCantidadCarritoActivo = async (req, res) => {
  try {
    const { tipo, id } = req.user;

    const idUsuarioApp = tipo === "usuariosapp" ? id : null;
    const idCliente = tipo === "clientes" ? id : null;

    const [carritoRows] = await db.query(
      `SELECT id_carrito FROM carrito 
       WHERE (id_usuario_app = ? OR id_cliente = ?) 
       AND activo = TRUE
       ORDER BY fecha_creacion DESC
       LIMIT 1`,
      [idUsuarioApp, idCliente]
    );

    if (!carritoRows.length) return res.json({ total: 0 });

    const idCarrito = carritoRows[0].id_carrito;

    const [detalleRows] = await db.query(
      `SELECT COALESCE(SUM(cantidad),0) AS total FROM detallecarrito 
       WHERE id_carrito = ?`,
      [idCarrito]
    );

    res.json({ total: detalleRows[0].total || 0 });
  } catch (error) {
    console.error("Error al obtener cantidad de carrito:", error);
    res.status(500).json({ message: "Error al obtener cantidad de carrito" });
  }
};

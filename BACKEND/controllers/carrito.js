import db from "../config/dataBase.js";


// Obtener todos los carritos activos (info básica para icono de carrito)

export const getAllCarritos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.id_carrito, c.id_cliente, c.id_usuario_app, c.id_sucursal, c.fecha_creacion, c.activo,
             cl.nombre AS nombre_cliente, ua.usuario AS nombre_usuario_app, s.nombre AS sucursal
      FROM carrito c
      LEFT JOIN Clientes cl ON c.id_cliente = cl.id_cliente
      LEFT JOIN UsuariosApp ua ON c.id_usuario_app = ua.id_usuario
      LEFT JOIN Sucursales s ON c.id_sucursal = s.idSucursal
      WHERE c.activo = TRUE
      ORDER BY c.fecha_creacion DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener carritos:", error);
    res.status(500).json({ message: "Error al obtener carritos" });
  }
};


// Obtener carrito por ID con detalle de productos

export const getCarritoById = async (req, res) => {
  try {
    const { id_carrito } = req.params;

    // Info general del carrito
    const [carritoRows] = await db.query(`
      SELECT c.id_carrito, c.id_cliente, c.id_usuario_app, c.id_sucursal, c.fecha_creacion, c.activo,
             cl.nombre AS nombre_cliente, ua.usuario AS nombre_usuario_app, s.nombre AS sucursal
      FROM carrito c
      LEFT JOIN Clientes cl ON c.id_cliente = cl.id_cliente
      LEFT JOIN UsuariosApp ua ON c.id_usuario_app = ua.id_usuario
      LEFT JOIN Sucursales s ON c.id_sucursal = s.idSucursal
      WHERE c.id_carrito = ?
    `, [id_carrito]);

    if (!carritoRows.length) return res.status(404).json({ message: "Carrito no encontrado" });

    const carrito = carritoRows[0];

    // Productos dentro del carrito
    const [detalle] = await db.query(`
      SELECT dc.id_detalle, dc.id_producto, p.nombre AS nombre_producto, dc.cantidad, dc.subtotal
      FROM detalle_carrito dc
      INNER JOIN productos p ON dc.id_producto = p.id_producto
      WHERE dc.id_carrito = ?
    `, [id_carrito]);

    // Calcular total del carrito
    const total = detalle.reduce((acc, item) => acc + item.subtotal, 0);

    res.json({ carrito, detalle, total });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ message: "Error al obtener carrito con detalle" });
  }
};


// Crear nuevo carrito

export const createCarrito = async (req, res) => {
  try {
    const { id_cliente, id_usuario_app, id_sucursal } = req.body;

    if (!id_cliente && !id_usuario_app) {
      return res.status(400).json({ message: "Debe indicar id_cliente o id_usuario_app" });
    }

    const [result] = await db.query(`
      INSERT INTO carrito (id_cliente, id_usuario_app, id_sucursal, fecha_creacion, activo)
      VALUES (?, ?, ?, NOW(), TRUE)
    `, [id_cliente || null, id_usuario_app || null, id_sucursal || null]);

    res.status(201).json({ message: "Carrito creado", id_carrito: result.insertId });
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ message: "Error al crear carrito" });
  }
};


// Actualizar carrito (ej: cambiar sucursal o estado activo)

export const updateCarrito = async (req, res) => {
  try {
    const { id_carrito } = req.params;
    const { id_sucursal, activo } = req.body;

    await db.query(`
      UPDATE carrito
      SET id_sucursal = ?, activo = ?
      WHERE id_carrito = ?
    `, [id_sucursal || null, activo, id_carrito]);

    res.json({ message: "Carrito actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    res.status(500).json({ message: "Error al actualizar carrito" });
  }
};


// Eliminar carrito

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

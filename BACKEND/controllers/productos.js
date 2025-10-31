import db from "../config/dataBase.js";

// Obtener todos los productos
export const getAllProductos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id_producto, p.nombre, p.descripcion, p.precio_actual,
             p.id_categoria, c.nombre AS nombre_categoria, p.estado,
             p.imagen_url, p.subcategoria
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      ORDER BY p.nombre ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

// Obtener producto por ID
export const getProductoById = async (req, res) => {
  try {
    const { id_producto } = req.params;
    const [rows] = await db.query(`
      SELECT p.id_producto, p.nombre, p.descripcion, p.precio_actual,
             p.id_categoria, c.nombre AS nombre_categoria, p.estado,
             p.imagen_url, p.subcategoria
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.id_producto = ?
    `, [id_producto]);

    if (!rows.length) return res.status(404).json({ message: "Producto no encontrado" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error al obtener producto" });
  }
};

// Crear nuevo producto
export const createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio_actual, id_categoria, estado, imagen_url, subcategoria } = req.body;

    if (!nombre || precio_actual == null || !id_categoria || !estado) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await db.query(`
      INSERT INTO productos (nombre, descripcion, precio_actual, id_categoria, estado, imagen_url, subcategoria)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [nombre, descripcion || "", precio_actual, id_categoria, estado, imagen_url || null, subcategoria || null]);

    // Devolver producto creado completo
    const [rows] = await db.query("SELECT * FROM productos WHERE id_producto = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ message: "Error al crear producto" });
  }
};

export const updateProductoConImagen = async (req, res) => {
  try {
    const { id_producto } = req.params;
    const { nombre, descripcion, precio_actual, id_categoria, estado, subcategoria } = req.body;

    // Si se subió un archivo, construimos la ruta pública
    const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Actualizar producto en la DB, usando COALESCE para no sobreescribir si no hay imagen nueva
    await db.query(
      `UPDATE productos
       SET nombre = ?, descripcion = ?, precio_actual = ?, id_categoria = ?, estado = ?, subcategoria = ?, imagen_url = COALESCE(?, imagen_url)
       WHERE id_producto = ?`,
      [nombre, descripcion, precio_actual, id_categoria, estado, subcategoria, imagen_url, id_producto]
    );

    // Devolver producto actualizado
    const [rows] = await db.query("SELECT * FROM productos WHERE id_producto = ?", [id_producto]);
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error al actualizar producto", error });
  }
};

// Eliminar producto
export const deleteProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;
    await db.query("DELETE FROM productos WHERE id_producto = ?", [id_producto]);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};

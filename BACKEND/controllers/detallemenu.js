import db from "../config/dataBase.js";


// Obtener todos los detalles de un menú

export const getDetalleMenuByMenu = async (req, res) => {
  try {
    const { id_menu } = req.params;

    const [rows] = await db.query(`
      SELECT dm.id_detalle_menu, dm.id_menu, dm.id_producto, p.nombre AS nombre_producto, dm.cantidad
      FROM detalle_menu dm
      LEFT JOIN productos p ON dm.id_producto = p.id_producto
      WHERE dm.id_menu = ?
    `, [id_menu]);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener detalle del menú:", error);
    res.status(500).json({ message: "Error al obtener detalle del menú" });
  }
};

// Agregar un producto al detalle de menú

export const addDetalleMenu = async (req, res) => {
  try {
    const { id_menu, id_producto, cantidad } = req.body;

    if (!id_menu || !id_producto || !cantidad) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await db.query(`
      INSERT INTO detalle_menu (id_menu, id_producto, cantidad)
      VALUES (?, ?, ?)
    `, [id_menu, id_producto, cantidad]);

    res.status(201).json({ message: "Producto agregado al detalle del menú", id_detalle_menu: result.insertId });
  } catch (error) {
    console.error("Error al agregar detalle al menú:", error);
    res.status(500).json({ message: "Error al agregar detalle al menú" });
  }
};


// Actualizar un detalle del menú

export const updateDetalleMenu = async (req, res) => {
  try {
    const { id_detalle_menu } = req.params;
    const { cantidad } = req.body;

    await db.query(`
      UPDATE detalle_menu
      SET cantidad = ?
      WHERE id_detalle_menu = ?
    `, [cantidad, id_detalle_menu]);

    res.json({ message: "Detalle del menú actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar detalle del menú:", error);
    res.status(500).json({ message: "Error al actualizar detalle del menú" });
  }
};


// Eliminar un detalle del menú

export const deleteDetalleMenu = async (req, res) => {
  try {
    const { id_detalle_menu } = req.params;
    await db.query("DELETE FROM detalle_menu WHERE id_detalle_menu = ?", [id_detalle_menu]);
    res.json({ message: "Detalle del menú eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar detalle del menú:", error);
    res.status(500).json({ message: "Error al eliminar detalle del menú" });
  }
};

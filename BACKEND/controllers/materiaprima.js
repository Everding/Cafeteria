import db from "../config/dataBase.js";

// =======================================================
//  Obtener todas las materias primas
// =======================================================
export const getAllMateriasPrimas = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        m.id_materia,
        m.nombre,
        m.unidad_medida,
        m.stock_actual,
        m.stock_minimo,
        m.estado,
        p.nombre AS proveedor,
        p.id_proveedor
      FROM materiaprima m
      LEFT JOIN proveedores p ON m.id_proveedor = p.id_proveedor
      ORDER BY m.nombre ASC
    `);

    res.json(rows); // envía todo, habilitados y deshabilitados
  } catch (error) {
    console.error("Error al obtener materias primas:", error);
    res.status(500).json({ message: "Error al obtener materias primas" });
  }
};

// =======================================================
//  Obtener materia prima por ID
// =======================================================
export const getMateriaPrimaById = async (req, res) => {
  try {
    const { id_materia } = req.params;

    const [rows] = await db.query(`
      SELECT 
        m.id_materia,
        m.nombre,
        m.unidad_medida,
        m.stock_actual,
        m.stock_minimo,
        m.estado,
        p.nombre AS proveedor,
        p.id_proveedor
      FROM materiaprima m
      LEFT JOIN proveedores p ON m.id_proveedor = p.id_proveedor
      WHERE m.id_materia = ?
    `, [id_materia]);

    if (!rows.length) return res.status(404).json({ message: "Materia prima no encontrada" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener materia prima:", error);
    res.status(500).json({ message: "Error al obtener materia prima" });
  }
};

// =======================================================
//  Crear nueva materia prima
// =======================================================
export const createMateriaPrima = async (req, res) => {
  try {
    const { nombre, unidad_medida, stock_actual, stock_minimo, id_proveedor } = req.body;

    if (!nombre || !unidad_medida || stock_actual == null || stock_minimo == null || !id_proveedor) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await db.query(`
      INSERT INTO materiaprima 
        (nombre, unidad_medida, stock_actual, stock_minimo, id_proveedor, estado)
      VALUES (?, ?, ?, ?, ?, 'habilitado')
    `, [nombre, unidad_medida, stock_actual, stock_minimo, id_proveedor]);

    res.status(201).json({ message: "Materia prima creada", id_materia: result.insertId });
  } catch (error) {
    console.error("Error al crear materia prima:", error);
    res.status(500).json({ message: "Error al crear materia prima" });
  }
};

// =======================================================
//  Actualizar materia prima
// =======================================================
export const updateMateriaPrima = async (req, res) => {
  try {
    const { id_materia } = req.params;
    const { nombre, unidad_medida, stock_actual, stock_minimo, id_proveedor } = req.body;

    await db.query(`
      UPDATE materiaprima
      SET nombre = ?, unidad_medida = ?, stock_actual = ?, stock_minimo = ?, id_proveedor = ?
      WHERE id_materia = ?
    `, [nombre, unidad_medida, stock_actual, stock_minimo, id_proveedor, id_materia]);

    res.json({ message: "Materia prima actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar materia prima:", error);
    res.status(500).json({ message: "Error al actualizar materia prima" });
  }
};

// =======================================================
//  Eliminar materia prima
// =======================================================
export const deleteMateriaPrima = async (req, res) => {
  try {
    const { id_materia } = req.params;
    await db.query("DELETE FROM materiaprima WHERE id_materia = ?", [id_materia]);
    res.json({ message: "Materia prima eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar materia prima:", error);
    res.status(500).json({ message: "Error al eliminar materia prima" });
  }
};

// =======================================================
//  Cambiar estado (habilitado / deshabilitado)
// =======================================================
export const cambiarEstado = async (req, res) => {
  const { id_materia } = req.params;
  const { estado } = req.body;

  if (!estado || (estado !== "habilitado" && estado !== "deshabilitado")) {
    return res.status(400).json({ message: "Estado inválido" });
  }

  try {
    await db.query(
      "UPDATE materiaprima SET estado = ? WHERE id_materia = ?",
      [estado, id_materia]
    );
    res.json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    console.error("Error cambiando estado:", error);
    res.status(500).json({ error: "Error al cambiar estado" });
  }
};

// =======================================================
//  Actualizar solo stock_actual de una materia prima
// =======================================================
export const actualizarStockMateria = async (req, res) => {
  const { id_materia } = req.params;
  const { cantidad } = req.body;

  if (cantidad == null) return res.status(400).json({ message: "Falta la cantidad" });

  try {
    await db.query(
      "UPDATE materiaprima SET stock_actual = stock_actual + ? WHERE id_materia = ?",
      [cantidad, id_materia]
    );
    res.json({ message: "Stock actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar stock:", error);
    res.status(500).json({ message: "Error al actualizar stock" });
  }
};

// =======================================================
//  Actualizar stock de todas las materias primas de un producto
// =======================================================
export const actualizarStockProducto = async (req, res) => {
  const { id_producto } = req.params;
  const materias = req.body; // debe ser [{ id_materia, cantidad_necesaria }, ...]

  if (!Array.isArray(materias)) {
    return res.status(400).json({ message: "Debe enviarse un array de materias primas" });
  }

  try {
    // Primero eliminamos las asignaciones anteriores
    await db.query("DELETE FROM stock WHERE id_producto = ?", [id_producto]);

    // Insertamos las nuevas
    for (const m of materias) {
      if (!m.id_materia || m.cantidad_necesaria == null) continue;

      await db.query(
        "INSERT INTO stock (id_producto, id_materia, cantidad_necesaria) VALUES (?, ?, ?)",
        [id_producto, m.id_materia, m.cantidad_necesaria]
      );
    }

    res.json({ message: "Materias primas guardadas correctamente" });
  } catch (error) {
    console.error("Error actualizando stock del producto:", error);
    res.status(500).json({ message: "Error al actualizar stock del producto" });
  }
};
// =======================================================
//  Obtener materias necesarias para un producto
// =======================================================
export const obtenerStockProducto = async (req, res) => {
  const { id_producto } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT s.id_materia, m.nombre, s.cantidad_necesaria
      FROM stock s
      INNER JOIN materiaprima m ON s.id_materia = m.id_materia
      WHERE s.id_producto = ?
    `, [id_producto]);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener stock del producto:", error);
    res.status(500).json({ error: "Error al obtener stock del producto" });
  }
};

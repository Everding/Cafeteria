import db from "../config/dataBase.js";


// Obtener todas las materias primas
export const getAllMateriasPrimas = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.id_materia, m.nombre, m.unidad_medida, m.stock_actual, m.stock_minimo,
             p.nombre AS proveedor
      FROM materiaprima m
      LEFT JOIN proveedores p ON m.id_proveedor = p.id_proveedor
      ORDER BY m.nombre ASC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener materias primas:", error);
    res.status(500).json({ message: "Error al obtener materias primas" });
  }
};


// Obtener materia prima por ID

export const getMateriaPrimaById = async (req, res) => {
  try {
    const { id_materia } = req.params;

    const [rows] = await db.query(`
      SELECT m.id_materia, m.nombre, m.unidad_medida, m.stock_actual, m.stock_minimo,
             p.nombre AS proveedor
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


// Crear nueva materia prima

export const createMateriaPrima = async (req, res) => {
  try {
    const { nombre, unidad_medida, stock_actual, stock_minimo, id_proveedor } = req.body;

    if (!nombre || !unidad_medida || stock_actual == null || stock_minimo == null || !id_proveedor) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await db.query(`
      INSERT INTO materia_prima (nombre, unidad_medida, stock_actual, stock_minimo, id_proveedor)
      VALUES (?, ?, ?, ?, ?)
    `, [nombre, unidad_medida, stock_actual, stock_minimo, id_proveedor]);

    res.status(201).json({ message: "Materia prima creada", id_materia: result.insertId });
  } catch (error) {
    console.error("Error al crear materia prima:", error);
    res.status(500).json({ message: "Error al crear materia prima" });
  }
};


// Actualizar materia prima

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


// Eliminar materia prima

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


// Actualizar el stock (relación producto ↔ materias primas)
export const actualizarStockProducto = async (req, res) => {
  const { id_producto } = req.params;
  const { materiasPrimas } = req.body; // array de objetos { id_materia, cantidad_necesaria }

  if (!Array.isArray(materiasPrimas))
    return res.status(400).json({ error: "materiasPrimas debe ser un array" });

  try {
    // 1️⃣ Eliminar registros previos de este producto
    await db.query("DELETE FROM stock WHERE id_producto = ?", [id_producto]);

    // 2️⃣ Insertar los nuevos vínculos
    for (const { id_materia, cantidad_necesaria } of materiasPrimas) {
      await db.query(
        "INSERT INTO stock (id_producto, id_materia, cantidad_necesaria) VALUES (?, ?, ?)",
        [id_producto, id_materia, cantidad_necesaria || 1] // si no envían cantidad, ponemos 1
      );
    }

    res.json({ message: "Materias primas actualizadas correctamente" });
  } catch (error) {
    console.error("Error al actualizar stock:", error);
    res.status(500).json({ error: "Error al actualizar stock" });
  }
};

// Actualizar solo stock_actual de una materia prima
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




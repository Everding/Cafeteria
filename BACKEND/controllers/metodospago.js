import db from "../config/dataBase.js";


// Obtener todos los métodos de pago

export const getAllMetodosPago = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id_metodo_pago, tipo, descripcion
      FROM metodos_pago
      ORDER BY tipo ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener métodos de pago:", error);
    res.status(500).json({ message: "Error al obtener métodos de pago" });
  }
};


// Obtener método de pago por ID

export const getMetodoPagoById = async (req, res) => {
  try {
    const { id_metodo_pago } = req.params;
    const [rows] = await db.query(`
      SELECT id_metodo_pago, tipo, descripcion
      FROM metodos_pago
      WHERE id_metodo_pago = ?
    `, [id_metodo_pago]);

    if (!rows.length) return res.status(404).json({ message: "Método de pago no encontrado" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener método de pago:", error);
    res.status(500).json({ message: "Error al obtener método de pago" });
  }
};


// Crear nuevo método de pago

export const createMetodoPago = async (req, res) => {
  try {
    const { tipo, descripcion } = req.body;

    if (!tipo) {
      return res.status(400).json({ message: "El tipo de método de pago es obligatorio" });
    }

    const [result] = await db.query(`
      INSERT INTO metodos_pago (tipo, descripcion)
      VALUES (?, ?)
    `, [tipo, descripcion || ""]);

    res.status(201).json({ message: "Método de pago creado", id_metodo_pago: result.insertId });
  } catch (error) {
    console.error("Error al crear método de pago:", error);
    res.status(500).json({ message: "Error al crear método de pago" });
  }
};


// Actualizar método de pago

export const updateMetodoPago = async (req, res) => {
  try {
    const { id_metodo_pago } = req.params;
    const { tipo, descripcion } = req.body;

    await db.query(`
      UPDATE metodos_pago
      SET tipo = ?, descripcion = ?
      WHERE id_metodo_pago = ?
    `, [tipo, descripcion, id_metodo_pago]);

    res.json({ message: "Método de pago actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar método de pago:", error);
    res.status(500).json({ message: "Error al actualizar método de pago" });
  }
};


// Eliminar método de pago

export const deleteMetodoPago = async (req, res) => {
  try {
    const { id_metodo_pago } = req.params;
    await db.query("DELETE FROM metodos_pago WHERE id_metodo_pago = ?", [id_metodo_pago]);
    res.json({ message: "Método de pago eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar método de pago:", error);
    res.status(500).json({ message: "Error al eliminar método de pago" });
  }
};

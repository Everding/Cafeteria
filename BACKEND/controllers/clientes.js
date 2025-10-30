import db from "../config/dataBase.js";


// Obtener todos los clientes (mesas)

export const getAllClientes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.idCliente, c.NumeroMesa, c.estado, c.totalConsumido, s.nombre AS sucursal
      FROM Clientes c
      LEFT JOIN Sucursales s ON c.idSucursal = s.idSucursal
      ORDER BY c.NumeroMesa ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};


// Obtener cliente por ID

export const getClienteById = async (req, res) => {
  try {
    const { idCliente } = req.params;
    const [rows] = await db.query(`
      SELECT c.idCliente, c.NumeroMesa, c.estado, c.totalConsumido, s.nombre AS sucursal
      FROM Clientes c
      LEFT JOIN Sucursales s ON c.idSucursal = s.idSucursal
      WHERE c.idCliente = ?
    `, [idCliente]);

    if (!rows.length) return res.status(404).json({ message: "Cliente no encontrado" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({ message: "Error al obtener cliente" });
  }
};


// Crear nuevo cliente (mesa)

export const createCliente = async (req, res) => {
  try {
    const { NumeroMesa, idSucursal } = req.body;

    if (!NumeroMesa || !idSucursal) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await db.query(`
      INSERT INTO Clientes (NumeroMesa, estado, totalConsumido, idSucursal)
      VALUES (?, 'Disponible', 0, ?)
    `, [NumeroMesa, idSucursal]);

    res.status(201).json({ message: "Cliente (mesa) creado", idCliente: result.insertId });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ message: "Error al crear cliente" });
  }
};


// Actualizar cliente (ej: cambiar estado o totalConsumido)

export const updateCliente = async (req, res) => {
  try {
    const { idCliente } = req.params;
    const { estado, totalConsumido } = req.body;

    await db.query(`
      UPDATE Clientes
      SET estado = ?, totalConsumido = ?
      WHERE idCliente = ?
    `, [estado, totalConsumido, idCliente]);

    res.json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ message: "Error al actualizar cliente" });
  }
};


// Eliminar cliente

export const deleteCliente = async (req, res) => {
  try {
    const { idCliente } = req.params;
    await db.query("DELETE FROM Clientes WHERE idCliente = ?", [idCliente]);
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ message: "Error al eliminar cliente" });
  }
};

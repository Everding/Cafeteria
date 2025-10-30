import db from "../config/dataBase.js";


// Obtener todos los turnos

export const getAllTurnos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT idTurno, nombreTurno, horaEntrada, horaSalida, activo
      FROM turnos
      ORDER BY horaEntrada ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener turnos:", error);
    res.status(500).json({ message: "Error al obtener turnos" });
  }
};


// Obtener turno por ID

export const getTurnoById = async (req, res) => {
  try {
    const { idTurno } = req.params;
    const [rows] = await db.query(`
      SELECT idTurno, nombreTurno, horaEntrada, horaSalida, activo
      FROM turnos
      WHERE idTurno = ?
    `, [idTurno]);

    if (!rows.length) return res.status(404).json({ message: "Turno no encontrado" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener turno:", error);
    res.status(500).json({ message: "Error al obtener turno" });
  }
};


// Crear nuevo turno

export const createTurno = async (req, res) => {
  try {
    const { nombreTurno, horaEntrada, horaSalida, activo } = req.body;

    if (!nombreTurno || !horaEntrada || !horaSalida) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await db.query(`
      INSERT INTO turnos (nombreTurno, horaEntrada, horaSalida, activo)
      VALUES (?, ?, ?, ?)
    `, [nombreTurno, horaEntrada, horaSalida, activo || 1]);

    res.status(201).json({ message: "Turno creado", idTurno: result.insertId });
  } catch (error) {
    console.error("Error al crear turno:", error);
    res.status(500).json({ message: "Error al crear turno" });
  }
};


// Actualizar turno

export const updateTurno = async (req, res) => {
  try {
    const { idTurno } = req.params;
    const { nombreTurno, horaEntrada, horaSalida, activo } = req.body;

    await db.query(`
      UPDATE turnos
      SET nombreTurno = ?, horaEntrada = ?, horaSalida = ?, activo = ?
      WHERE idTurno = ?
    `, [nombreTurno, horaEntrada, horaSalida, activo, idTurno]);

    res.json({ message: "Turno actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar turno:", error);
    res.status(500).json({ message: "Error al actualizar turno" });
  }
};


// Eliminar turno

export const deleteTurno = async (req, res) => {
  try {
    const { idTurno } = req.params;
    await db.query("DELETE FROM turnos WHERE idTurno = ?", [idTurno]);
    res.json({ message: "Turno eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar turno:", error);
    res.status(500).json({ message: "Error al eliminar turno" });
  }
};

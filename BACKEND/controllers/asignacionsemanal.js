import db from "../config/dataBase.js";


// Obtener todas las asignaciones semanales

export const getAllAsignaciones = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.idAsignacion, p.nombre AS personal, s.nombre AS sucursal, t.nombre AS turno, 
             a.fechaInicioSemana, a.fechaFinSemana
      FROM asignacionSemanal a
      INNER JOIN personal p ON a.idPersonal = p.idPersonal
      INNER JOIN sucursales s ON a.idSucursal = s.idSucursal
      INNER JOIN turnos t ON a.idTurno = t.idTurno
      ORDER BY a.fechaInicioSemana DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener asignaciones semanales:", error);
    res.status(500).json({ message: "Error al obtener asignaciones semanales" });
  }
};

// Obtener asignación por ID

export const getAsignacionById = async (req, res) => {
  try {
    const { idAsignacion } = req.params;
    const [rows] = await db.query(`
      SELECT a.idAsignacion, p.nombre AS personal, s.nombre AS sucursal, t.nombre AS turno, 
             a.fechaInicioSemana, a.fechaFinSemana
      FROM asignacionSemanal a
      INNER JOIN personal p ON a.idPersonal = p.idPersonal
      INNER JOIN sucursales s ON a.idSucursal = s.idSucursal
      INNER JOIN turnos t ON a.idTurno = t.idTurno
      WHERE a.idAsignacion = ?
    `, [idAsignacion]);

    if (!rows.length) return res.status(404).json({ message: "Asignación no encontrada" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener asignación:", error);
    res.status(500).json({ message: "Error al obtener asignación" });
  }
};

// Crear nueva asignación semanal

export const createAsignacion = async (req, res) => {
  try {
    const { idPersonal, idSucursal, idTurno, fechaInicioSemana, fechaFinSemana } = req.body;

    if (!idPersonal || !idSucursal || !idTurno || !fechaInicioSemana || !fechaFinSemana) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    await db.query(`
      INSERT INTO asignacionSemanal (idPersonal, idSucursal, idTurno, fechaInicioSemana, fechaFinSemana)
      VALUES (?, ?, ?, ?, ?)
    `, [idPersonal, idSucursal, idTurno, fechaInicioSemana, fechaFinSemana]);

    res.status(201).json({ message: "Asignación semanal creada correctamente" });
  } catch (error) {
    console.error("Error al crear asignación:", error);
    res.status(500).json({ message: "Error al crear asignación semanal" });
  }
};


// Actualizar asignación semanal

export const updateAsignacion = async (req, res) => {
  try {
    const { idAsignacion } = req.params;
    const { idPersonal, idSucursal, idTurno, fechaInicioSemana, fechaFinSemana } = req.body;

    await db.query(`
      UPDATE asignacionSemanal
      SET idPersonal = ?, idSucursal = ?, idTurno = ?, fechaInicioSemana = ?, fechaFinSemana = ?
      WHERE idAsignacion = ?
    `, [idPersonal, idSucursal, idTurno, fechaInicioSemana, fechaFinSemana, idAsignacion]);

    res.json({ message: "Asignación semanal actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar asignación:", error);
    res.status(500).json({ message: "Error al actualizar asignación semanal" });
  }
};


// Eliminar asignación semanal

export const deleteAsignacion = async (req, res) => {
  try {
    const { idAsignacion } = req.params;
    await db.query("DELETE FROM asignacionSemanal WHERE idAsignacion = ?", [idAsignacion]);
    res.json({ message: "Asignación semanal eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar asignación:", error);
    res.status(500).json({ message: "Error al eliminar asignación semanal" });
  }
};

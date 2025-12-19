import db from "../config/dataBase.js";

// ==================================================
// Obtener todas las asignaciones semanales
// ==================================================
export const getAllAsignaciones = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.idAsignacion,
        a.idPersonal,
        a.idSucursal,
        a.idTurno,
        DATE_FORMAT(a.fechaInicioSemana, '%Y-%m-%d') AS fechaInicioSemana,
        DATE_FORMAT(a.fechaFinSemana, '%Y-%m-%d') AS fechaFinSemana,

        CONCAT(p.nombre, ' ', p.apellido) AS personal,
        p.dni,
        p.correo,
        p.idRol,
        p.imagen_url,

        s.nombreSucursal AS sucursal,
        s.direccion AS direccionSucursal,

        t.nombreTurno AS turno,
        TIME_FORMAT(t.horaEntrada, '%H:%i') AS horaEntrada,
        TIME_FORMAT(t.horaSalida, '%H:%i') AS horaSalida,
        t.activo AS turnoActivo

      FROM asignacionsemanal a
      JOIN personal p ON a.idPersonal = p.idPersonal
      JOIN sucursales s ON a.idSucursal = s.idSucursal
      JOIN turnos t ON a.idTurno = t.idTurno
      ORDER BY s.idSucursal, t.idTurno, p.nombre;
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener las asignaciones:", error);
    res.status(500).json({ message: "Error al obtener las asignaciones" });
  }
};

// ==================================================
// Obtener asignación por ID
// ==================================================
export const getAsignacionById = async (req, res) => {
  try {
    const { idAsignacion } = req.params;
    const [rows] = await db.query(`
      SELECT 
        a.idAsignacion,
        CONCAT(p.nombre, ' ', p.apellido) AS personal,
        s.nombreSucursal AS sucursal,
        t.nombreTurno AS turno,
        DATE_FORMAT(a.fechaInicioSemana, '%Y-%m-%d') AS fechaInicioSemana,
        DATE_FORMAT(a.fechaFinSemana, '%Y-%m-%d') AS fechaFinSemana
      FROM asignacionsemanal a
      INNER JOIN personal p ON a.idPersonal = p.idPersonal
      INNER JOIN sucursales s ON a.idSucursal = s.idSucursal
      INNER JOIN turnos t ON a.idTurno = t.idTurno
      WHERE a.idAsignacion = ?
    `, [idAsignacion]);

    if (rows.length === 0)
      return res.status(404).json({ message: "Asignación no encontrada" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener asignación:", error);
    res.status(500).json({ message: "Error al obtener asignación" });
  }
};

// ==================================================
// Crear nueva asignación semanal
// ==================================================
export const createAsignacion = async (req, res) => {
  try {
    const { idPersonal, idSucursal, idTurno, fechaInicioSemana, fechaFinSemana } = req.body;

    if (!idPersonal || !idSucursal || !idTurno || !fechaInicioSemana || !fechaFinSemana) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    await db.query(`
      INSERT INTO asignacionsemanal (idPersonal, idSucursal, idTurno, fechaInicioSemana, fechaFinSemana)
      VALUES (?, ?, ?, ?, ?)
    `, [idPersonal, idSucursal, idTurno, fechaInicioSemana, fechaFinSemana]);

    res.status(201).json({ message: "Asignación semanal creada correctamente" });
  } catch (error) {
    console.error("Error al crear asignación:", error);
    res.status(500).json({ message: "Error al crear asignación semanal" });
  }
};

// ==================================================
// Actualizar asignación semanal
// ==================================================
export const updateAsignacion = async (req, res) => {
  try {
    const { idAsignacion } = req.params;
    const { idSucursal, idTurno, fechaInicioSemana, fechaFinSemana, idPersonal } = req.body;

    if (!idSucursal || !idTurno || !fechaInicioSemana || !fechaFinSemana || !idPersonal) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await db.query(
      `UPDATE asignacionsemanal 
       SET idSucursal = ?, idTurno = ?, fechaInicioSemana = ?, fechaFinSemana = ?
       WHERE idAsignacion = ?`,
      [idSucursal, idTurno, fechaInicioSemana, fechaFinSemana, idAsignacion]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Asignación no encontrada" });
    }

    res.status(200).json({ message: "Asignación actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar asignación:", error);
    res.status(500).json({ message: "Error al actualizar asignación" });
  }
};

// ==================================================
// Eliminar asignación semanal
// ==================================================
export const deleteAsignacion = async (req, res) => {
  try {
    const { idAsignacion } = req.params;
    await db.query("DELETE FROM asignacionsemanal WHERE idAsignacion = ?", [idAsignacion]);
    res.json({ message: "Asignación semanal eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar asignación:", error);
    res.status(500).json({ message: "Error al eliminar asignación semanal" });
  }
};

// ==================================================
// Obtener empleados sin asignar
// ==================================================
export const getEmpleadosSinAsignar = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.idPersonal,
        p.nombre,
        p.apellido,
        p.dni,
        p.imagen_url,
        p.correo,
        p.idRol
      FROM personal p
      WHERE p.idRol <> 1
        AND p.idPersonal NOT IN (
          SELECT idPersonal FROM asignacionsemanal
        )
      ORDER BY p.nombre;
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener empleados sin asignar:", error);
    res.status(500).json({ error: "Error al obtener empleados sin asignar" });
  }
};


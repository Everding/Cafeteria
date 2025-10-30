import db from "../config/dataBase.js";

// Obtener todo el personal
export const getPersonal = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Personal");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el personal", error });
  }
};

// Crear nuevo personal
export const createPersonal = async (req, res) => {
  try {
    const { nombre, apellido, idRol, idSucursal } = req.body;
    await db.query(
      "INSERT INTO Personal (nombre, apellido, idRol, idSucursal) VALUES (?, ?, ?, ?)",
      [nombre, apellido, idRol, idSucursal]
    );
    res.json({ message: "Personal agregado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear personal", error });
  }
};

// Actualizar información del personal (por ejemplo, cambiar sucursal)
export const updatePersonal = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, idRol, idSucursal } = req.body;
    await db.query(
      "UPDATE Personal SET nombre=?, apellido=?, idRol=?, idSucursal=? WHERE idPersonal=?",
      [nombre, apellido, idRol, idSucursal, id]
    );
    res.json({ message: "Personal actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar personal", error });
  }
};

// Eliminar personal
export const deletePersonal = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM Personal WHERE idPersonal=?", [id]);
    res.json({ message: "Personal eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar personal", error });
  }
};

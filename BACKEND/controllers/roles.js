import db from "../config/dataBase.js";

// Obtener todos los roles
export const getRoles = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Roles");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener roles", error });
  }
};

// Crear rol
export const createRol = async (req, res) => {
  try {
    const { nombreRol, descripcion } = req.body;
    await db.query("INSERT INTO Roles (nombreRol, descripcion) VALUES (?, ?)", [nombreRol, descripcion]);
    res.json({ message: "Rol creado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear rol", error });
  }
};

// Actualizar rol
export const updateRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreRol, descripcion } = req.body;
    await db.query("UPDATE Roles SET nombreRol=?, descripcion=? WHERE idRol=?", [nombreRol, descripcion, id]);
    res.json({ message: "Rol actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar rol", error });
  }
};

// Eliminar rol
export const deleteRol = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM Roles WHERE idRol=?", [id]);
    res.json({ message: "Rol eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar rol", error });
  }
};

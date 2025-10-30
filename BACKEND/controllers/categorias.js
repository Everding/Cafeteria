// controllers/categorias.js
import db from "../config/dataBase.js"; // tu conexión MySQL (usa mysql2 o similar)

// Obtener todas las categorías (visible para cliente y admin)
export const getCategorias = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Categorias");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener categorías", error });
  }
};

// Obtener productos de una categoría (cliente o admin)
export const getProductosPorCategoria = async (req, res) => {
  const { id_categoria } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT p.id_producto, p.nombre, p.descripcion, p.precio_actual, p.estado
       FROM Productos p
       WHERE p.id_categoria = ? AND p.estado = 'disponible'`,
      [id_categoria]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos por categoría", error });
  }
};

// Crear nueva categoría (solo admin)
export const crearCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO Categorias (nombre, descripcion) VALUES (?, ?)",
      [nombre, descripcion]
    );
    res.status(201).json({ id: result.insertId, nombre, descripcion });
  } catch (error) {
    res.status(500).json({ message: "Error al crear categoría", error });
  }
};

// Editar categoría (solo admin)
export const actualizarCategoria = async (req, res) => {
  const { id_categoria } = req.params;
  const { nombre, descripcion } = req.body;

  try {
    await db.query(
      "UPDATE Categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?",
      [nombre, descripcion, id_categoria]
    );
    res.status(200).json({ message: "Categoría actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar categoría", error });
  }
};

// Eliminar categoría (solo admin)
export const eliminarCategoria = async (req, res) => {
  const { id_categoria } = req.params;

  try {
    await db.query("DELETE FROM Categorias WHERE id_categoria = ?", [id_categoria]);
    res.status(200).json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar categoría", error });
  }
};

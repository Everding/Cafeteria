import db from "../config/dataBase.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// ===============================
// CONFIGURACIÓN DE MULTER
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads/personal");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

// ===============================
// Obtener todo el personal
// ===============================
export const getPersonal = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Personal");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener el personal:", error);
    res.status(500).json({ message: "Error al obtener el personal" });
  }
};

// ===============================
// Crear nuevo personal
// ===============================
export const createPersonal = async (req, res) => {
  try {
    const { nombre, apellido, dni, correo, contrasena, idRol } = req.body;

    console.log("Body recibido:", req.body);
    console.log("Archivo recibido:", req.file);

    if (!nombre || !apellido || !correo || !contrasena || !idRol) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const imagen_url = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/personal/${req.file.filename}`
      : "https://i.pravatar.cc/150?img=3";

    await db.query(
      `INSERT INTO Personal (nombre, apellido, dni, correo, contraseña, idRol, imagen_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, dni, correo, contrasena, idRol, imagen_url]
    );

    res.status(201).json({ message: "Personal agregado correctamente" });
  } catch (error) {
    console.error("Error al crear personal:", error);
    res.status(500).json({ message: "Error al crear personal" });
  }
};
// ===============================
// Actualizar personal
// ===============================
export const updatePersonal = async (req, res) => {
  try {
    const { idPersonal } = req.params;
    const { nombre, apellido, dni, correo, contrasena, idRol } = req.body;

    // Verificar si existe el empleado
    const [empleadoActual] = await db.query(
      "SELECT * FROM Personal WHERE idPersonal = ?",
      [idPersonal]
    );
    if (empleadoActual.length === 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    // Conservar la contraseña actual si no se envía una nueva
    const contrasenaFinal =
      contrasena && contrasena.trim() !== ""
        ? contrasena
        : empleadoActual[0].contrasena;

    // Manejo de imagen nueva (si se sube)
    let imagen_url = empleadoActual[0].imagen_url;
    if (req.file) {
      // Borrar imagen anterior si existía
      if (imagen_url && fs.existsSync(path.resolve(imagen_url.replace("http://localhost:3000/", "")))) {
        fs.unlinkSync(path.resolve(imagen_url.replace("http://localhost:3000/", "")));
      }
      imagen_url = `http://localhost:3000/uploads/personal/${req.file.filename}`;
    }

    // Actualizar datos
    await db.query(
      `UPDATE Personal 
       SET nombre=?, apellido=?, dni=?, correo=?, contraseña=?, idRol=?, imagen_url=?
       WHERE idPersonal=?`,
      [nombre, apellido, dni, correo, contraseñaFinal, idRol, imagen_url, idPersonal]
    );

    res.json({ message: "Empleado actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar personal:", error);
    res.status(500).json({ message: "Error al actualizar personal", error });
  }
};

// ===============================
// Eliminar personal
// ===============================
export const deletePersonal = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM Personal WHERE idPersonal=?", [id]);

    res.json({ message: "Personal eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar personal:", error);
    res.status(500).json({ message: "Error al eliminar personal" });
  }
};

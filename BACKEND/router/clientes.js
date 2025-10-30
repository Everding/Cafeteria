import express from "express";
import {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente
} from "../controllers/clientes.js";

const router = express.Router();

// Obtener todos los clientes (mesas)
router.get("/", getAllClientes);

// Obtener cliente por ID
router.get("/:idCliente", getClienteById);

// Crear nuevo cliente (mesa)
router.post("/", createCliente);

// Actualizar cliente
router.put("/:idCliente", updateCliente);

// Eliminar cliente
router.delete("/:idCliente", deleteCliente);

export default router;

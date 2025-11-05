import express from "express";
import {
  getPersonal,
  createPersonal,
  updatePersonal,
  deletePersonal,
  upload,
} from "../controllers/personal.js";

const router = express.Router();

// GET todos
router.get("/", getPersonal);

// POST nuevo
router.post("/", upload.single("imagen"), createPersonal);

// PUT actualizar por ID
router.put("/:idPersonal", upload.single("imagen"), updatePersonal);


// DELETE eliminar por ID
router.delete("/:id", deletePersonal);

export default router;

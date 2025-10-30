import express from "express";
import {
  getPersonal,
  createPersonal,
  updatePersonal,
  deletePersonal,
} from "../controllers/personal.js";

const router = express.Router();

router.get("/", getPersonal);
router.post("/", createPersonal);
router.put("/:id", updatePersonal);
router.delete("/:id", deletePersonal);

export default router;

import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import type { Caso } from "../types.js";
import { verifyToken } from "../middleware/auth.js";
import { CreateCasoDTO } from "../dtos/CreateCasoDTO.js";
import { UpdateCasoDTO } from "../dtos/UpdateCasoDTO.js";
import { validateDTO } from "../utils/validation.js";
import { seedCasos } from "../seeds/seedCasos.js";
import { BadRequestException, NotFoundException } from "../filters/HttpExceptionFilter.js";

const router = Router();

// "DB" en memoria (si quieres persistir usa fs)
let casos: Caso[] = [...seedCasos];

router.use(verifyToken); // proteger todas las rutas siguientes

router.get("/", (req, res) => {
  res.json(casos);
});

router.post("/", validateDTO(CreateCasoDTO), (req, res) => {
  const { nombre, descripcion, estado, prioridad, responsable } = req.body;

  const nuevo: Caso = {
    id: uuidv4(),
    nombre,
    descripcion: descripcion || "",
    estado: estado || "nuevo",
    prioridad,
    responsable: responsable && typeof responsable === "string" ? responsable : undefined
  };
  casos.push(nuevo);
  res.status(201).json(nuevo);
});

router.put("/:id", validateDTO(UpdateCasoDTO), (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, estado, prioridad, responsable } = req.body;
  const idx = casos.findIndex(c => c.id === id);
  
  if (idx === -1 || !casos[idx]) {
    return res.status(404).json({ 
      statusCode: 404, 
      message: "Caso no encontrado",
      timestamp: new Date().toISOString()
    });
  }

  const casoActual = casos[idx];
  const actualizado: Caso = {
    id: casoActual.id,
    nombre: nombre ?? casoActual.nombre,
    descripcion: descripcion ?? casoActual.descripcion,
    estado: estado ?? casoActual.estado,
    prioridad: prioridad ?? casoActual.prioridad,
    responsable: responsable !== undefined ? responsable : casoActual.responsable
  };
  casos[idx] = actualizado;
  res.json(actualizado);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const idx = casos.findIndex(c => c.id === id);
  
  if (idx === -1) {
    return res.status(404).json({ 
      statusCode: 404, 
      message: "Caso no encontrado",
      timestamp: new Date().toISOString()
    });
  }
  
  const removed = casos.splice(idx, 1)[0];
  res.json({ removed });
});

export default router;

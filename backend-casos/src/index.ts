import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import casosRoutes from "./routes/casos.js";
import { HttpExceptionFilter } from "./filters/HttpExceptionFilter.js";

const app = express();
app.use(cors({ origin: "http://localhost:3000" })); // permitir frontend local
app.use(express.json());


app.get('/', (req, res) => {
	res.json({ message: 'Backend casos API funcionando' });
});

app.use("/auth", authRoutes);
app.use("/casos", casosRoutes);

// Manejo global de errores
app.use(HttpExceptionFilter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend escuchando en http://localhost:${PORT}`));

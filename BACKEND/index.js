import express from "express";
import cors from "cors";
import categoriasRoutes from "./router/categorias.js";
import comprasRoutes from "./router/compras.js";
import detalleMenuRoutes from "./router/detallemenu.js";
import carritoRoutes from "./router/carrito.js";
import detalleCarritoRoutes from "./router/detallecarrito.js";
import rolesRouter from "./router/roles.js";
import personalRouter from "./router/personal.js";
import clientesRouter from "./router/clientes.js";
import usuariosAppRouter from "./router/usuariosapp.js";
import loginRouter from "./router/login.js";
import asignacionSemanalRouter from "./router/asignacionsemanal.js";
import detallePedidosRoutes from "./router/detallepedidos.js";
import historialPreciosRoutes from "./router/historialprecios.js";
import materiaPrimaRoutes from "./router/materiaprima.js";
import menusPrefabricadosRoutes from "./router/menusprefabricados.js";
import metodosPagoRoutes from "./router/metodospago.js";
import pedidosRoutes from "./router/pedidos.js";
import productosRoutes from "./router/productos.js";
import proveedoresRoutes from "./router/proveedores.js";
import resenasRoutes from "./router/reseñas.js";
import stockRoutes from "./router/stock.js";
import sucursalesRoutes from "./router/sucursales.js";
import turnosRoutes from "./router/turnos.js";
import ventasRoutes from "./router/ventas.js";
import registerRoutes from "./router/register.js";
import multer from "multer";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/categorias", categoriasRoutes);
app.use("/api/compras", comprasRoutes);
app.use("/api/detalle-menu", detalleMenuRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/detalle-carrito", detalleCarritoRoutes);
app.use("/api/roles", rolesRouter);
app.use("/api/personal", personalRouter);
app.use("/api/clientes", clientesRouter);
app.use("/api/usuarios-app", usuariosAppRouter);
app.use("/api/login", loginRouter);
app.use("/api/asignacion-semanal", asignacionSemanalRouter);
app.use("/api/detalle-pedidos", detallePedidosRoutes);
app.use("/api/historial-precios", historialPreciosRoutes);
app.use("/api/materia-prima", materiaPrimaRoutes);
app.use("/api/menus-prefabricados", menusPrefabricadosRoutes);
app.use("/api/metodos-pago", metodosPagoRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/proveedores", proveedoresRoutes);
app.use("/api/resenas", resenasRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/sucursales", sucursalesRoutes);
app.use("/api/turnos", turnosRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api", registerRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // guarda en /uploads
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // nombre único
  },
});

const upload = multer({ storage });



app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));


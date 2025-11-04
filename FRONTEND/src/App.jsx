import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  LOGIN, HOME, MENUSPREFABRICADOS, ORDENAR, BEBIDAS, ACOMPAÑANTES, POSTRES, 
  KIOSCO, NUESTROSPRODUCTOS, PEDIDOS, EMPLEADOS, ADMINISTRAREMPLEADOS, STOCK, 
  VENTAS, COMPRAS, REGISTER, MIPERFIL, CARRITO, EQUIPO, NUESTRAHISTORIA, SUCURSALES, RESEÑA, CONTACTANOS
} from './routers/router';

// Páginas
import LoginPage from "./pages/LoginPage";
import Home from './pages/Home';
import PrehechosPage from './pages/menu/PrehechosPage';
import OrdenarPage from './pages/menu/OrdenarPage';
import BebidasPage from './pages/menu/BebidasPage';
import AcompañantesPage from './pages/menu/AcompañantesPage'; 
import PostresPage from './pages/menu/PostresPage';
import KioscoPage from './pages/menu/KioscoPage';
import NuestrosProductosPage from './pages/menu/NuestrosProductosPage';
import PedidosentrantesPage from './pages/staff/PedidosentrantesPage';
import EmpleadosPage from './pages/staff/EmpleadosPage';
import AdministrarEmpleadosPage from './pages/staff/AdministrarempleadosPage';
import StockPage from './pages/staff/StockPage';
import VentasPage from './pages/staff/VentasPage';
import ComprasPage from './pages/staff/ComprasPage';
import RegisterPage from './pages/RegisterPage';
import MiPerfilPage from './pages/MiperfilPage';
import CarritoPage from './pages/CarritoPage';
import Header from './components/Header';
import EquipoPage from './pages/nosotros/EquipoPage';
import NuestraHistoriaPage from './pages/nosotros/NuestrahistoriaPage';
import SucursalesPage from './pages/nosotros/SucursalesPage';
import ReseñaPage from './pages/nosotros/ReseñasPage';
import ContactanosPage from './pages/ContactanosPage';

const AppContent = () => {
  const location = useLocation();
  const [cantidadProductos, setCantidadProductos] = useState(0);
  const idCarrito = 1; // ⚠️ Cambiar si usás un carrito por usuario
  const noHeaderRoutes = [HOME];

  // 🔁 Función que obtiene la cantidad total desde el backend
  const cargarCantidadCarrito = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/detalle-carrito/count/${idCarrito}`);
      setCantidadProductos(res.data.total || 0);
    } catch (error) {
      console.error("Error cargando cantidad del carrito:", error);
    }
  };

  // 🧠 Carga inicial + actualización cuando se emite el evento global
  useEffect(() => {
    cargarCantidadCarrito();

    // Escucha evento global para refrescar cantidad
    const handleUpdate = () => cargarCantidadCarrito();
    window.addEventListener("carritoActualizado", handleUpdate);

    return () => window.removeEventListener("carritoActualizado", handleUpdate);
  }, []);

  return (
    <>
      {!noHeaderRoutes.includes(location.pathname) && (
        <Header cantidadProductos={cantidadProductos} />
      )}

      <Routes>
        <Route path={HOME} element={<Home />} />
        <Route path={LOGIN} element={<LoginPage />} />
        <Route path={MENUSPREFABRICADOS} element={<PrehechosPage />} />
        <Route path={ORDENAR} element={<OrdenarPage />} />
        <Route path={BEBIDAS} element={<BebidasPage />} />
        <Route path={ACOMPAÑANTES} element={<AcompañantesPage />} />
        <Route path={POSTRES} element={<PostresPage />} />
        <Route path={KIOSCO} element={<KioscoPage />} />
        <Route path={NUESTROSPRODUCTOS} element={<NuestrosProductosPage />} />
        <Route path={PEDIDOS} element={<PedidosentrantesPage />} />
        <Route path={EMPLEADOS} element={<EmpleadosPage />} />
        <Route path={ADMINISTRAREMPLEADOS} element={<AdministrarEmpleadosPage />} />
        <Route path={STOCK} element={<StockPage />} />
        <Route path={VENTAS} element={<VentasPage />} />
        <Route path={COMPRAS} element={<ComprasPage />} />
        <Route path={REGISTER} element={<RegisterPage />} />
        <Route path={MIPERFIL} element={<MiPerfilPage />} />
        <Route path={CARRITO} element={<CarritoPage />} />
        <Route path={EQUIPO} element={<EquipoPage />} />
        <Route path={NUESTRAHISTORIA} element={<NuestraHistoriaPage />} />
        <Route path={SUCURSALES} element={<SucursalesPage />} />
        <Route path={RESEÑA} element={<ReseñaPage />} />
        <Route path={CONTACTANOS} element={<ContactanosPage />} />
      </Routes>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;

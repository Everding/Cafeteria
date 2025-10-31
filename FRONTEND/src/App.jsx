import React, { useState } from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
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
  const [detalle, setDetalle] = useState([]);
  const totalItems = detalle.reduce((acc, item) => acc + item.cantidad, 0);
  const noHeaderRoutes = [HOME];

  return (
    <>
      {!noHeaderRoutes.includes(location.pathname) && (
        <Header cantidadProductos={totalItems} />
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
        <Route path={CARRITO} element={<CarritoPage detalle={detalle} setDetalle={setDetalle} />} />
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

import React, { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { LOGIN, HOME, MENUSPREFABRICADOS, ORDENAR, BEBIDAS, ACOMPAÑANTES, POSTRES, KIOSCO, NUESTROSPRODUCTOS, PEDIDOS, EMPLEADOS, ADMINISTRAREMPLEADOS, STOCK, VENTAS, COMPRAS,
REGISTER, MIPERFIL, CARRITO } from './routers/router';

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

// Header
import Header from './components/Header';

const App = () => {
  // Estado del carrito: empieza vacío
  const [detalle, setDetalle] = useState([]);

  // Total de productos en el carrito
  const totalItems = detalle.reduce((acc, item) => acc + item.cantidad, 0);
  return (
    <BrowserRouter>
      {/* Pasamos la cantidad de productos al Header */}
      <Header cantidadProductos={totalItems} />

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
        {/* Pasamos detalle y setDetalle a CarritoPage */}
        <Route path={CARRITO} element={<CarritoPage detalle={detalle} setDetalle={setDetalle} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

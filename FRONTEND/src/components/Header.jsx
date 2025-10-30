import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
import { RiAccountCircleFill } from "react-icons/ri";
import { TiShoppingCart } from "react-icons/ti";
import Logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { HOME } from "../routers/router";

const Header = ({ cantidadProductos = 0 }) => { // <-- agregamos prop

  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de sesión

  // Detecta sesión al cargar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const navigate = useNavigate();

  const handleMouseEnter = (menu) => {
    setOpenDropdown(menu);
  };

  const handleMouseLeave = () => {
    setTimeout(() => setOpenDropdown(null), 200);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <header className="headerGeneral">
      <nav className="nav-containerGeneral">
        <img src={Logo} alt="Café Logo" className="logoGeneral" onClick={() => navigate(HOME)} id='LogoGeneral'/>

        <ul className="nav-linksGeneral">
          {/* Tus links existentes */}
          <li
            className="nav-itemGeneral"
            onMouseEnter={() => handleMouseEnter("nosotros")}
            onMouseLeave={handleMouseLeave}
          >
            <a href="#" className="nav-linkGeneral">Nosotros</a>
            <div className={`dropdownGeneral ${openDropdown === "nosotros" ? "open" : ""}`}>
              <a href="#">Equipo</a>
              <a href="#">Nuestra historia</a>
              <a href="#">Sucursales</a>
              <a href="#">Reseña</a>
            </div>
          </li>

          <li
            className="nav-itemGeneral"
            onMouseEnter={() => handleMouseEnter("menu")}
            onMouseLeave={handleMouseLeave}
          >
            <a href="/Menus/Ordenar" className="nav-linkGeneral">Menú</a>
            <div className={`dropdownGeneral ${openDropdown === "menu" ? "open" : ""}`}>
              <a href="/Menus/Prefabricados">Prehechos</a>
              <a href="/NuestrosProductos">Nuestros productos</a>
              <a href="/Menus/Ordenar">Ordenar</a>
            </div>
          </li>

          <li className="nav-itemGeneral">
            <a href="#" className="nav-linkGeneral">Promociones</a>
          </li>

          <li
            className="nav-itemGeneral"
            onMouseEnter={() => handleMouseEnter("staff")}
            onMouseLeave={handleMouseLeave}
          >
            <a href="/Pedidos" className="nav-linkGeneral">Staff</a>
            <div className={`dropdownGeneral ${openDropdown === "staff" ? "open" : ""}`}>
              <a href="/Pedidos">Pedidos entrantes</a>
              <a href="/Stock">Stock</a>
              <a href="/Empleados">Empleados</a>
              <a href="/Ventas">Ventas</a>
              <a href="/Compras">Compras</a>
            </div>
          </li>
        </ul>

        {/* Icono de carrito con badge */}
        <div className="cart-containerGeneral">
          <TiShoppingCart className="cart-iconGeneral" onClick={() => navigate("/Carrito")} />
          {cantidadProductos > 0 && (
            <span className="cart-badgeGeneral">{cantidadProductos}</span>
          )}
        </div>

        <div
          className="profileGeneral"
          onMouseEnter={() => handleMouseEnter("profile")}
          onMouseLeave={handleMouseLeave}
        >
          <RiAccountCircleFill className="profile-iconGeneral" />
          <div className={`dropdownGeneral ${openDropdown === "profile" ? "open" : ''}`}>
            {isLoggedIn ? (
              <>
                <a href="/perfil">Mi perfil</a>
                <a href="#" onClick={handleLogout}>Cerrar sesión</a>
              </>
            ) : (
              <>
                <a href="/Login">Iniciar sesión</a>
                <a href="/Register">Registrarse</a>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

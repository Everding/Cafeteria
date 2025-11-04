import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
import { RiAccountCircleFill } from "react-icons/ri";
import { TiShoppingCart } from "react-icons/ti";
import Logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { HOME } from "../routers/router";

const Header = ({ cantidadProductos = 0 }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Detecta si el usuario tiene sesión activa
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleMouseEnter = (menu) => setOpenDropdown(menu);
  const handleMouseLeave = () => setTimeout(() => setOpenDropdown(null), 200);

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <header className="headerGeneral">
      <nav className="nav-containerGeneral">
        <img
          src={Logo}
          alt="Café Logo"
          className="logoGeneral"
          onClick={() => navigate(HOME)}
          id='LogoGeneral'
        />

        <ul className="nav-linksGeneral">
          <li
            className="nav-itemGeneral"
            onMouseEnter={() => handleMouseEnter("nosotros")}
            onMouseLeave={handleMouseLeave}
          >
            <a href="/Nosotros/NuestraHistoria" className="nav-linkGeneral">Nosotros</a>
            <div className={`dropdownGeneral ${openDropdown === "nosotros" ? "open" : ""}`}>
              <a href="/Nosotros/Equipo">Equipo</a>
              <a href="/Nosotros/NuestraHistoria">Nuestra historia</a>
              <a href="/Nosotros/Sucursales">Sucursales</a>
              <a href="/Nosotros/Reseña">Reseña</a>
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
            <a href="/Contactanos" className="nav-linkGeneral">Contactanos</a>
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

        {/* 🛒 Carrito con badge */}
        <div className="cart-containerGeneral">
          <TiShoppingCart
            className="cart-iconGeneral"
            onClick={() => navigate("/Carrito")}
          />
          {cantidadProductos > 0 && (
            <span className="cart-badgeGeneral">{cantidadProductos}</span>
          )}
        </div>

        {/* 👤 Perfil / Sesión */}
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

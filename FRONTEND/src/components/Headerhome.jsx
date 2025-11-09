import React, { useState, useEffect } from 'react';
import '../styles/HeaderHome.css';
import { RiAccountCircleFill } from "react-icons/ri";
import { TiShoppingCart } from "react-icons/ti";
import Logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const HeaderHome = () => {
  const [openDropdown, setOpenDropdown] = useState({
    nosotros: false,
    menu: false,
    catalogo: false,
    staff: false,
    profile: false,
  });

  const navigate = useNavigate();
  const { user, tipo, idRol, token, logout } = useAuth();

  const isLoggedIn = !!token;
  const fotoPerfil = user?.imagen_url || null;

  // 🖱 Manejo dropdowns
  const handleMouseEnter = (menu) => setOpenDropdown({ ...openDropdown, [menu]: true });
  const handleMouseLeave = (menu) => setTimeout(() => setOpenDropdown({ ...openDropdown, [menu]: false }), 200);
  const handleDropdownClick = (menu) => setOpenDropdown({ ...openDropdown, [menu]: !openDropdown[menu] });

  const handleCartClick = () => navigate("/Carrito");

  const handleLogout = () => {
    logout();
    navigate("/Login");
  };

  const renderStaffLinks = () => {
    if (!idRol || tipo !== "personal") return null;

    switch (idRol) {
      case 1:
        return (
          <>
            <a href="/Pedidos" className="headerhome-dropdown-item">Pedidos entrantes</a>
            <a href="/Stock" className="headerhome-dropdown-item">Stock</a>
            <a href="/Empleados" className="headerhome-dropdown-item">Empleados</a>
            <a href="/Ventas" className="headerhome-dropdown-item">Ventas</a>
            <a href="/Compras" className="headerhome-dropdown-item">Compras</a>
          </>
        );
      case 2:
        return (
          <>
            <a href="/Pedidos" className="headerhome-dropdown-item">Pedidos entrantes</a>
            <a href="/Stock" className="headerhome-dropdown-item">Stock</a>
            <a href="/Ventas" className="headerhome-dropdown-item">Ventas</a>
            <a href="/Compras" className="headerhome-dropdown-item">Compras</a>
          </>
        );
      case 3:
        return <a href="/Pedidos" className="headerhome-dropdown-item">Pedidos entrantes</a>;
      default:
        return null;
    }
  };

  return (
    <header className="headerhome-header">
      <nav className="headerhome-nav">
        <img
          src={Logo}
          alt="Café Logo"
          className="headerhome-logo"
          onClick={() => navigate("/")}
        />

        <ul className="headerhome-nav-links">
          <li
            className="headerhome-nav-item"
            onMouseEnter={() => handleMouseEnter("nosotros")}
            onMouseLeave={() => handleMouseLeave("nosotros")}
            onClick={() => handleDropdownClick("nosotros")}
          >
            <a href="/Nosotros/NuestraHistoria" className="headerhome-nav-link">Nosotros</a>
            <div className={`headerhome-dropdown ${openDropdown.nosotros ? 'open' : ''}`}>
              <a href="/Nosotros/Equipo" className="headerhome-dropdown-item">Equipo</a>
              <a href="/Nosotros/NuestraHistoria" className="headerhome-dropdown-item">Nuestra historia</a>
              <a href="/Nosotros/Sucursales" className="headerhome-dropdown-item">Sucursales</a>
              <a href="/Nosotros/Reseña" className="headerhome-dropdown-item">Reseña</a>
            </div>
          </li>

          <li
            className="headerhome-nav-item"
            onMouseEnter={() => handleMouseEnter("menu")}
            onMouseLeave={() => handleMouseLeave("menu")}
            onClick={() => handleDropdownClick("menu")}
          >
            <a href="/Menus/Ordenar" className="headerhome-nav-link">Menú</a>
            <div className={`headerhome-dropdown ${openDropdown.menu ? 'open' : ''}`}>
              <a href="/Menus/Prefabricados" className="headerhome-dropdown-item">Prehechos</a>
              <a href="/NuestrosProductos" className="headerhome-dropdown-item">Nuestros productos</a>
              <a href="/Menus/Ordenar" className="headerhome-dropdown-item">Ordenar</a>
            </div>
          </li>

          <li
            className="headerhome-nav-item"
            onMouseEnter={() => handleMouseEnter("catalogo")}
            onMouseLeave={() => handleMouseLeave("catalogo")}
            onClick={() => handleDropdownClick("catalogo")}
          >
            <a href="/Contactanos" className="headerhome-nav-link">Contactanos</a>
          </li>

          {/* Staff dinámico */}
          {isLoggedIn && tipo === "personal" && (
            <li
              className="headerhome-nav-item"
              onMouseEnter={() => handleMouseEnter("staff")}
              onMouseLeave={() => handleMouseLeave("staff")}
              onClick={() => handleDropdownClick("staff")}
            >
              <a href="/Pedidos" className="headerhome-nav-link">Staff</a>
              <div className={`headerhome-dropdown ${openDropdown.staff ? 'open' : ''}`}>
                {renderStaffLinks()}
              </div>
            </li>
          )}
        </ul>

        <div className="headerhome-nav-icons">
          <TiShoppingCart className="headerhome-cart-icon" onClick={handleCartClick} />

          <div
            className="headerhome-profile-container"
            onMouseEnter={() => handleMouseEnter("profile")}
            onMouseLeave={() => handleMouseLeave("profile")}
            onClick={() => handleDropdownClick("profile")}
          >
            {fotoPerfil ? (
              <img src={fotoPerfil} alt="Perfil" className="headerhome-profile-icon" />
            ) : (
              <RiAccountCircleFill className="headerhome-profile-icon" />
            )}

            <div className={`headerhome-profile-dropdown ${openDropdown.profile ? 'open' : ''}`}>
              {isLoggedIn ? (
                <>
                  <a href="/MiPerfil" className='headerhome-dropdown-item'>Mi perfil</a>
                  <a href="#" className='headerhome-dropdown-item' onClick={handleLogout}>Cerrar sesión</a>
                </>
              ) : (
                <>
                  <a href="/Login" className='headerhome-dropdown-item'>Iniciar sesión</a>
                  <a href="/Register" className='headerhome-dropdown-item'>Registrarse</a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="headerhome-promo-banner">
        <h1>Realiza tu pedido justo aquí</h1>
      </div>

      <div className="headerhome-order-button-container">
        <a href="/Menus/Ordenar" className="headerhome-order-button">Ordenar</a>
      </div>

      <div className="headerhome-location-banner">
        <p>Sucursal: 1</p>
      </div>
    </header>
  );
};

export default HeaderHome;

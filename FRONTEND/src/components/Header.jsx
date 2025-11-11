import React, { useState, useEffect } from "react";
import { RiAccountCircleFill } from "react-icons/ri";
import { TiShoppingCart } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/Header.css";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const { user, token, logout, loading } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [badgeCantidad, setBadgeCantidad] = useState(0);

  const fotoPerfil = user?.imagen_url;

  // 🔹 Actualizar badge
  const actualizarBadge = async () => {
    if (!token) {
      setBadgeCantidad(0);
      return;
    }

    try {
      const { data: carrito } = await axios.get(
        "http://localhost:3000/api/carrito/activo",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!carrito?.id_carrito) {
        setBadgeCantidad(0);
        return;
      }

      const { data } = await axios.get(
        `http://localhost:3000/api/detalle-carrito/count/${carrito.id_carrito}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBadgeCantidad(Number(data.total) || 0);
    } catch (err) {
      console.error("Error actualizando badge:", err);
      setBadgeCantidad(0);
    }
  };

  useEffect(() => {
    if (!loading) {
      actualizarBadge();
      window.addEventListener("carritoActualizado", actualizarBadge);
    }
    return () => window.removeEventListener("carritoActualizado", actualizarBadge);
  }, [token, loading]);

  const handleMouseEnter = (menu) => setOpenDropdown(menu);
  const handleMouseLeave = () => setOpenDropdown(null);

  const handleLogout = () => {
    logout();
    setBadgeCantidad(0);
    navigate("/Login");
  };

  const renderStaffLinks = () => {
    const idRol = user?.idRol;
    if (!idRol) return null;
    switch (idRol) {
      case 1:
        return (
          <>
            <a href="/Pedidos">Pedidos entrantes</a>
            <a href="/Stock">Stock</a>
            <a href="/Empleados">Empleados</a>
            <a href="/Ventas">Ventas</a>
            <a href="/Compras">Compras</a>
          </>
        );
      case 2:
        return (
          <>
            <a href="/Pedidos">Pedidos entrantes</a>
            <a href="/Stock">Stock</a>
            <a href="/Ventas">Ventas</a>
            <a href="/Compras">Compras</a>
          </>
        );
      case 3:
        return <a href="/Pedidos">Pedidos entrantes</a>;
      default:
        return null;
    }
  };

  return (
    <header className="headerGeneral">
      <nav className="nav-containerGeneral">
        <img
          src={Logo}
          alt="Café Logo"
          className="logoGeneral"
          onClick={() => navigate("/")}
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

          {[1, 2, 3].includes(user?.idRol) && (
            <li
              className="nav-itemGeneral"
              onMouseEnter={() => handleMouseEnter("staff")}
              onMouseLeave={handleMouseLeave}
            >
              <a href="/Pedidos" className="nav-linkGeneral">Staff</a>
              <div className={`dropdownGeneral ${openDropdown === "staff" ? "open" : ""}`}>
                {renderStaffLinks()}
              </div>
            </li>
          )}
        </ul>

        <div className="cart-containerGeneral" onClick={() => navigate("/Carrito")}>
          <TiShoppingCart className="cart-iconGeneral" />
          {badgeCantidad > 0 && <span className="cart-badgeGeneral">{badgeCantidad}</span>}
        </div>

        <div
          className="profileGeneral"
          onMouseEnter={() => handleMouseEnter("profile")}
          onMouseLeave={handleMouseLeave}
        >
          {fotoPerfil ? (
            <img src={fotoPerfil} alt="Foto de perfil" className="profile-imageGeneral" />
          ) : (
            <RiAccountCircleFill className="profile-iconGeneral" />
          )}
          <div className={`dropdownGeneral ${openDropdown === "profile" ? "open" : ""}`}>
            {user ? (
              <>
                <a href="/MiPerfil">Mi perfil</a>
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

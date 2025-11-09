import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext.jsx";
import "../../../styles/Menu/MenuCard.css";

const MenuCard = ({ menu, onUpdate, triggerEdit }) => {
  const [editing, setEditing] = useState(false);
  const [titulo, setTitulo] = useState(menu.nombre);
  const [descripcion, setDescripcion] = useState(menu.descripcion);
  const [precio, setPrecio] = useState(menu.precio_total);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    if (triggerEdit) setEditing(true);
  }, [triggerEdit]);

  const handleGuardar = async () => {
    try {
      let updatedMenu = { nombre: titulo, descripcion, precio_total: precio, estado: menu.estado, imagen_url: menu.imagen_url };

      if (file) {
        const formData = new FormData();
        formData.append("imagen", file);
        formData.append("nombre", titulo);
        formData.append("descripcion", descripcion);
        formData.append("precio_total", precio);
        formData.append("estado", menu.estado);

        const res = await axios.put(
          `http://localhost:3000/api/menus-prefabricados/${menu.id_menu}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        updatedMenu = res.data;
      } else {
        const res = await axios.put(
          `http://localhost:3000/api/menus-prefabricados/${menu.id_menu}`,
          updatedMenu
        );
        updatedMenu = res.data;
      }

      onUpdate(menu.id_menu, updatedMenu);
      setEditing(false);
      setFile(null);
    } catch (error) {
      console.error("Error al guardar menú:", error);
      alert("No se pudo guardar el menú");
    }
  };

  const handleAgregarCarrito = async () => {
    if (!token) return alert("Debes iniciar sesión para agregar productos al carrito");

    try {
      setLoading(true);

      // Obtener carrito activo del usuario
      const { data: carrito } = await axios.get(
        "http://localhost:3000/api/carrito/activo",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!carrito?.id_carrito) throw new Error("No se pudo obtener el carrito activo");

      // Agregar detalle del carrito
      await axios.post(
        "http://localhost:3000/api/detalle-carrito",
        {
          id_carrito: carrito.id_carrito,
          id_menu_prefabricado: menu.id_menu, // ✅ corregido
          cantidad: 1,
          subtotal: menu.precio_total
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Disparar evento global para actualizar badge y carrito
      window.dispatchEvent(new Event("carritoActualizado"));

      alert("Producto agregado al carrito");
    } catch (error) {
      console.error("Error al agregar al carrito:", error.response?.data || error);
      alert(error.response?.data?.message || "Error al agregar al carrito");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-card">
      {editing ? (
        <>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <img
            src={menu.imagen_url ? `http://localhost:3000${menu.imagen_url}` : "https://via.placeholder.com/150"}
            alt={titulo}
          />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          <input type="number" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} />
          <div className="menu-actions">
            <button onClick={handleGuardar}>Guardar</button>
            <button onClick={() => setEditing(false)}>Cancelar</button>
          </div>
        </>
      ) : (
        <>
          <h3>{titulo}</h3>
          <img
            src={menu.imagen_url ? `http://localhost:3000${menu.imagen_url}` : "https://via.placeholder.com/150"}
            alt={titulo}
          />
          <div className="menu-details menu-details-white">
            <p>{descripcion}</p>
          </div>
          <div className="menu-price">${precio}</div>
          <button className="add-to-cart" onClick={handleAgregarCarrito} disabled={loading}>
            {loading ? "Agregando..." : "Agregar al carrito"}
          </button>
        </>
      )}
    </div>
  );
};

export default MenuCard;

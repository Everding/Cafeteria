import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../styles/Menu/MenuCard.css";

const MenuCard = ({ menu, onUpdate, triggerEdit }) => {
  const [editing, setEditing] = useState(false);
  const [titulo, setTitulo] = useState(menu.nombre);
  const [descripcion, setDescripcion] = useState(menu.descripcion);
  const [precio, setPrecio] = useState(menu.precio_total);
  const [file, setFile] = useState(null);

  // 🔹 Detectar cuando el padre pida editar
  useEffect(() => {
    if (triggerEdit) setEditing(true);
  }, [triggerEdit]);

  const handleGuardar = async () => {
    try {
      let updatedMenu = {
        nombre: titulo,
        descripcion,
        precio_total: precio,
        estado: menu.estado,
        imagen_url: menu.imagen_url,
      };

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

  // 🔹 Acción del botón “Agregar al carrito”
  const handleAgregarCarrito = () => {
    console.log(`🛒 Menú agregado al carrito: ${titulo}`);
    // 👉 Acá después puedes llamar a una función del padre o a tu contexto del carrito
  };

  return (
    <div className="menu-card">
      {editing ? (
        <>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <img
            src={menu.imagen_url ? `http://localhost:3000${menu.imagen_url}` : "https://via.placeholder.com/150"}
            alt={titulo}
          />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(Number(e.target.value))}
          />

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

          {/* 🔹 Botón Agregar al carrito */}
          <button className="add-to-cart" onClick={handleAgregarCarrito}>
            Agregar al carrito
          </button>
        </>
      )}
    </div>
  );
};

export default MenuCard;

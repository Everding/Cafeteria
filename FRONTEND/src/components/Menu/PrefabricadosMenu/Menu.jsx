import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuCard from "./MenuCard";
import "../../../styles/Menu/Menu.css";

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [editingId, setEditingId] = useState(null); // 🔹 Nuevo estado

  // 🔹 Cargar menús desde backend
  const fetchMenus = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/menus-prefabricados");
      setMenus(res.data);
    } catch (error) {
      console.error("Error al cargar menús:", error);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // 🔹 Agregar nuevo menú
  const agregarMenu = async () => {
    try {
      const nuevoMenu = {
        nombre: "Nuevo Menú",
        descripcion: "",
        precio_total: 0,
        estado: "activo",
        imagen_url: "/uploads/placeholder.png",
      };
      const res = await axios.post("http://localhost:3000/api/menus-prefabricados", nuevoMenu);
      setMenus([res.data, ...menus]);
    } catch (error) {
      console.error("Error al crear menú:", error);
    }
  };

  // 🔹 Actualizar menú
  const actualizarMenu = (id, menuActualizado) => {
    setMenus(menus.map((m) => (m.id_menu === id ? menuActualizado : m)));
    setEditingId(null); // 🔹 Salir del modo edición
  };

  // 🔹 Eliminar menú
  const eliminarMenu = async (id) => {
    if (!window.confirm("¿Eliminar este menú?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/menus-prefabricados/${id}`);
      setMenus(menus.filter((m) => m.id_menu !== id));
    } catch (error) {
      console.error("Error al eliminar menú:", error);
    }
  };

  return (
    <div className="menu-list">
      <div className="menu-list-header">
        <h1>Menús Prefabricados</h1>
        <button className="add-menuPage" onClick={agregarMenu}>Agregar Menú</button>
      </div>
      <div className="menu-container">
        {menus.length ? (
          menus.map((menu) => (
            <div key={menu.id_menu} className="menu-wrapper">
              <MenuCard
                menu={menu}
                onUpdate={actualizarMenu}
                triggerEdit={editingId === menu.id_menu} // 🔹 Nuevo prop
              />
              <div className="menu-buttons">
                <button onClick={() => setEditingId(menu.id_menu)}>Editar</button>
                <button onClick={() => eliminarMenu(menu.id_menu)}>Eliminar</button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay menús cargados.</p>
        )}
      </div>
    </div>
  );
};

export default MenuList;

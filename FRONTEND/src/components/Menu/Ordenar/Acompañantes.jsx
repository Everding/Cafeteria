import React, { useEffect, useState } from "react";
import axios from "axios";
import AcompañantesCard from "./AcompañantesCard";
import "../../../styles/Menu/Acompañantes.css";
import { useAuth } from "../../../context/AuthContext.jsx";

const Acompañantes = () => {
  const [products, setProducts] = useState([]);
  const [filtroSubcategoria, setFiltroSubcategoria] = useState("Todas");
  const [editingId, setEditingId] = useState(null);

  const { user } = useAuth();

  // 🔹 Cargar todos los productos
  const fetchProductos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/productos");
      setProducts(res.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // 🔹 Crear nuevo producto
  const agregarProducto = async () => {
    try {
      const nuevoProducto = {
        nombre: "Nuevo Acompañante",
        descripcion: "",
        precio_actual: 100,
        id_categoria: 2,
        estado: "disponible",
        imagen_url: "/uploads/placeholder.png",
        subcategoria: "Acompañantes",
      };
      const res = await axios.post("http://localhost:3000/api/productos", nuevoProducto);
      setProducts([res.data, ...products]);
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("No se pudo agregar el producto");
    }
  };

  // 🔹 Actualizar producto
  const actualizarProducto = (id, updatedProduct) => {
    setProducts(products.map(p => (p.id_producto === id ? updatedProduct : p)));
    setEditingId(null);
  };

  // 🔹 Eliminar producto
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/productos/${id}`);
      setProducts(products.filter(p => p.id_producto !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const mostrarBotones =
    user &&
    user.tipo !== "clientes" &&
    user.tipo !== "usuariosapp" &&
    (user.idRol === 1);

  // 🔹 Subcategorías
  const subcategoriasUnicas = [
    "Todas",
    ...Array.from(
      new Set(products.filter(p => p.id_categoria === 2).map(p => p.subcategoria || "Sin subcategoría"))
    ),
  ];

  const productosFiltrados = products
    .filter(p => p.id_categoria === 2)
    .filter(p => filtroSubcategoria === "Todas" || (p.subcategoria || "Sin subcategoría") === filtroSubcategoria);

  return (
    <div className="AcompañantesPage">
      <div className="AcompañantesPage-header">
        <h2>Acompañantes</h2>
        {mostrarBotones && (
          <button onClick={agregarProducto} className="AcompañantesPage-addProduct">
            Agregar Acompañante
          </button>
        )}
      </div>

      <div className="AcompañantesPage-filter">
        <label>Filtrar por subcategoría: </label>
        <select value={filtroSubcategoria} onChange={(e) => setFiltroSubcategoria(e.target.value)}>
          {subcategoriasUnicas.map((sub, idx) => (
            <option key={idx} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      <div className="AcompañantesPage-container">
        {productosFiltrados.length ? (
          productosFiltrados.map(product => (
            <div key={product.id_producto} className="AcompañantesCard-wrapper">
              <AcompañantesCard
                product={product}
                onUpdate={actualizarProducto}
                triggerEdit={editingId === product.id_producto}
              />
              {mostrarBotones && (
                <div className="AcompañantesCard-editDelete">
                  <button onClick={() => setEditingId(product.id_producto)}>Editar</button>
                  <button onClick={() => eliminarProducto(product.id_producto)}>Eliminar</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No hay acompañantes en esta subcategoría.</p>
        )}
      </div>
    </div>
  );
};

export default Acompañantes;

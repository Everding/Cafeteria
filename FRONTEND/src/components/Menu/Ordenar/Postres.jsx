import React, { useState, useEffect } from "react";
import axios from "axios";
import PostresCard from "./PostresCard";
import "../../../styles/Menu/Postres.css";

const Postres = () => {
  const [products, setProducts] = useState([]);
  const [filtroSubcategoria, setFiltroSubcategoria] = useState("Todas");

  // 🔹 Cargar productos desde backend
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

  // 🔹 Agregar nuevo producto
  const agregarProducto = async () => {
    try {
      const nuevoProducto = {
        nombre: "Nuevo Postre",
        descripcion: "Descripción del producto",
        precio_actual: 100,
        id_categoria: 4, // Postres
        estado: "disponible",
        imagen_url: "https://via.placeholder.com/120",
        subcategoria: "Torta",
      };
      const res = await axios.post("http://localhost:3000/api/productos", nuevoProducto);
      setProducts([res.data, ...products]);
    } catch (error) {
      console.error("Error al agregar producto:", error.response?.data || error.message);
      alert("No se pudo agregar el producto");
    }
  };

  // 🔹 Actualizar producto
  const actualizarProducto = async (id, datosActualizados) => {
    try {
      await axios.put(`http://localhost:3000/api/productos/${id}`, datosActualizados);
      fetchProductos();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert("Error al actualizar producto ❌");
    }
  };

  // 🔹 Eliminar producto
  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/productos/${id}`);
      setProducts(products.filter((p) => p.id_producto !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  // 🔹 Subcategorías únicas del postres
  const subcategoriasUnicas = [
    "Todas",
    ...Array.from(
      new Set(
        products
          .filter((p) => p.id_categoria === 4)
          .map((p) => p.subcategoria || "Sin subcategoría")
      )
    ),
  ];

  // 🔹 Filtrar productos a mostrar
  const productosFiltrados = products
    .filter((p) => p.id_categoria === 4)
    .filter(
      (p) =>
        filtroSubcategoria === "Todas" ||
        (p.subcategoria || "Sin subcategoría") === filtroSubcategoria
    );

  return (
    <div className="PostresPage">
      <div className="PostresPage-header">
        <h2>Postres</h2>
        <button className="PostresPage-addProduct" onClick={agregarProducto}>
          Agregar Producto
        </button>
      </div>

      <div className="PostresPage-filter">
        <label>Filtrar por subcategoría: </label>
        <select
          value={filtroSubcategoria}
          onChange={(e) => setFiltroSubcategoria(e.target.value)}
        >
          {subcategoriasUnicas.map((sub, idx) => (
            <option key={idx} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      <div className="PostresPage-container">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((product) => (
            <PostresCard
              key={product.id_producto}
              product={product}
              onUpdate={actualizarProducto}
              onDelete={eliminarProducto}
            />
          ))
        ) : (
          <p>No hay postres en esta subcategoría.</p>
        )}
      </div>
    </div>
  );
};

export default Postres;

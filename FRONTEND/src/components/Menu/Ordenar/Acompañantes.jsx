import React, { useState, useEffect } from "react";
import axios from "axios";
import AcompañantesCard from "./AcompañantesCard";
import "../../../styles/Menu/Acompañantes.css";

const Acompañantes = () => {
  const [products, setProducts] = useState([]);
  const [filtroSubcategoria, setFiltroSubcategoria] = useState("Todas");

  // 🔹 Cargar todos los productos desde el backend
  const fetchProductos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/productos");
      setProducts(res.data); // traemos todos los productos
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
        descripcion: "Descripción del producto",
        precio_actual: 100,
        id_categoria: 2, // Acompañantes
        estado: "disponible",
        imagen_url: "https://via.placeholder.com/120",
        subcategoria: "Acompañantes",
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
      fetchProductos(); // refresca lista
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

  // 🔹 Subcategorías únicas de acompañantes
  const subcategoriasUnicas = [
    "Todas",
    ...Array.from(
      new Set(
        products
          .filter((p) => p.id_categoria === 2) // solo acompañantes
          .map((p) => p.subcategoria || "Sin subcategoría") // manejar vacíos
      )
    ),
  ];

  // 🔹 Filtrado de productos para mostrar
  const productosFiltrados = products
    .filter((p) => p.id_categoria === 2) // solo acompañantes
    .filter(
      (p) =>
        filtroSubcategoria === "Todas" ||
        (p.subcategoria || "Sin subcategoría") === filtroSubcategoria
    );

  return (
    <div className="AcompañantesPage">
      <div className="AcompañantesPage-header">
        <h2>Acompañantes</h2>
        <button className="AcompañantesPage-addProduct" onClick={agregarProducto}>
          Agregar Acompañante
        </button>
      </div>

      <div className="AcompañantesPage-filter">
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

      <div className="AcompañantesPage-container">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((product) => (
            <AcompañantesCard
              key={product.id_producto}
              product={product}
              onUpdate={actualizarProducto}
              onDelete={eliminarProducto}
            />
          ))
        ) : (
          <p>No hay acompañantes en esta subcategoría.</p>
        )}
      </div>
    </div>
  );
};

export default Acompañantes;

import React, { useEffect, useState } from "react";
import axios from "axios";
import BebidasCard from "./BebidasCard";
import "../../../styles/Menu/Bebidas.css";
import { useAuth } from "../../../context/AuthContext.jsx";

const Bebidas = () => {
  const [products, setProducts] = useState([]);
  const [filtroSubcategoria, setFiltroSubcategoria] = useState("Todas");
  const [editingId, setEditingId] = useState(null);

  const { user } = useAuth();

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

  const agregarProducto = async () => {
    try {
      const nuevoProducto = {
        nombre: "Nueva Bebida",
        descripcion: "",
        precio_actual: 100,
        id_categoria: 1,
        estado: "habilitado",
        imagen_url: "/uploads/placeholder.png",
        subcategoria: "Bebidas",
      };
      const res = await axios.post("http://localhost:3000/api/productos", nuevoProducto);
      setProducts([res.data, ...products]);
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("No se pudo agregar el producto");
    }
  };

  const actualizarProducto = (id, updatedProduct) => {
    setProducts(products.map(p => (p.id_producto === id ? updatedProduct : p)));
    setEditingId(null);
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/productos/${id}`);
      setProducts(products.filter(p => p.id_producto !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const toggleEstadoProducto = async (producto) => {
    try {
      const nuevoEstado = producto.estado === "habilitado" ? "deshabilitado" : "habilitado";
      await axios.put(`http://localhost:3000/api/productos/estado/${producto.id_producto}`, { estado: nuevoEstado });
      setProducts(products.map(p => (p.id_producto === producto.id_producto ? { ...p, estado: nuevoEstado } : p)));
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const mostrarBotonesAdmin =
    user && user.tipo !== "clientes" && user.tipo !== "usuariosapp" && user.idRol === 1;

  const subcategoriasUnicas = [
    "Todas",
    ...Array.from(new Set(products.filter(p => p.id_categoria === 1).map(p => p.subcategoria || "Sin subcategoría")))
  ];

  // Filtrado: solo mostrar habilitados a clientes
  const productosFiltrados = products
    .filter(p => p.id_categoria === 1)
    .filter(p => filtroSubcategoria === "Todas" || (p.subcategoria || "Sin subcategoría") === filtroSubcategoria)
    .filter(p => user && (user.tipo !== "clientes" && user.tipo !== "usuariosapp") ? true : p.estado === "habilitado");

  return (
    <div className="BebidasPage">
      <div className="BebidasPage-header">
        <h2>Bebidas</h2>
        {mostrarBotonesAdmin && (
          <button className="BebidasPage-addProduct" onClick={agregarProducto}>Agregar Bebida</button>
        )}
      </div>

      <div className="BebidasPage-filter">
        <label>Filtrar por subcategoría: </label>
        <select value={filtroSubcategoria} onChange={(e) => setFiltroSubcategoria(e.target.value)}>
          {subcategoriasUnicas.map((sub, idx) => (
            <option key={idx} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      <div className="BebidasPage-container">
        {productosFiltrados.length ? (
          productosFiltrados.map(product => (
            <div
              key={product.id_producto}
              className="BebidasCard-wrapper"
              style={{ opacity: product.estado === "deshabilitado" ? 0.5 : 1 }}
            >
              <BebidasCard
                product={product}
                onUpdate={actualizarProducto}
                triggerEdit={editingId === product.id_producto}
              />

              {mostrarBotonesAdmin && (
                <div className="BebidasCard-editDelete">
                  <button className="BebidasCard-botonEditar" onClick={() => setEditingId(product.id_producto)}>Editar</button>
                  <button className="BebidasCard-botonEliminar" onClick={() => eliminarProducto(product.id_producto)}>Eliminar</button>
                  <button onClick={() => toggleEstadoProducto(product)}>
                    {product.estado === "habilitado" ? "Deshabilitar" : "Habilitar"}
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No hay bebidas en esta subcategoría.</p>
        )}
      </div>
    </div>
  );
};

export default Bebidas;

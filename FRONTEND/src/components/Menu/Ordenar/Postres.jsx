import React, { useEffect, useState } from "react";
import axios from "axios";
import PostresCard from "./PostresCard";
import "../../../styles/Menu/Postres.css";
import { useAuth } from "../../../context/AuthContext.jsx";

const Postres = () => {
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
        nombre: "Nuevo Postre",
        descripcion: "",
        precio_actual: 100,
        id_categoria: 4,
        estado: "habilitado",
        imagen_url: "/uploads/placeholder.png",
        subcategoria: "Torta",
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

  // Habilitar / Deshabilitar producto
  const toggleEstadoProducto = async (product) => {
    try {
      const nuevoEstado = product.estado === "habilitado" ? "deshabilitado" : "habilitado";
      await axios.put(`http://localhost:3000/api/productos/estado/${product.id_producto}`, { estado: nuevoEstado });
      setProducts(products.map(p => p.id_producto === product.id_producto ? { ...p, estado: nuevoEstado } : p));
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("No se pudo cambiar el estado del producto");
    }
  };

  const mostrarBotones =
    user &&
    user.tipo !== "clientes" &&
    user.tipo !== "usuariosapp" &&
    user.idRol === 1;

  const subcategoriasUnicas = [
    "Todas",
    ...Array.from(
      new Set(products.filter(p => p.id_categoria === 4).map(p => p.subcategoria || "Sin subcategoría"))
    ),
  ];

  //  Filtrado: solo mostrar habilitados para clientes
  const productosFiltrados = products
    .filter(p => p.id_categoria === 4)
    .filter(p => filtroSubcategoria === "Todas" || (p.subcategoria || "Sin subcategoría") === filtroSubcategoria)
    .filter(p => user && user.tipo === "clientes" ? p.estado === "habilitado" : true);

  return (
    <div className="PostresPage">
      <div className="PostresPage-header">
        <h2>Postres</h2>
        {mostrarBotones && (
          <button className="PostresPage-addProduct" onClick={agregarProducto}>Agregar Producto</button>
        )}
      </div>

      <div className="PostresPage-filter">
        <label>Filtrar por subcategoría: </label>
        <select value={filtroSubcategoria} onChange={(e) => setFiltroSubcategoria(e.target.value)}>
          {subcategoriasUnicas.map((sub, idx) => (
            <option key={idx} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      <div className="PostresPage-container">
        {productosFiltrados.length ? (
          productosFiltrados.map(product => (
            <div
              key={product.id_producto}
              className="PostresCard-wrapper"
              style={{ opacity: product.estado === "deshabilitado" ? 0.5 : 1 }}
            >
              <PostresCard
                product={product}
                onUpdate={actualizarProducto}
                triggerEdit={editingId === product.id_producto}
              />
              {mostrarBotones && (
                <div className="PostresCard-editDelete">
                  <button onClick={() => setEditingId(product.id_producto)}>Editar</button>
                  <button onClick={() => eliminarProducto(product.id_producto)}>Eliminar</button>
                  <button
                    onClick={() => toggleEstadoProducto(product)}
                    className={product.estado === "habilitado" ? "btn-deshabilitar" : "btn-habilitar"}
                  >
                    {product.estado === "habilitado" ? "Deshabilitar" : "Habilitar"}
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No hay postres en esta subcategoría.</p>
        )}
      </div>
    </div>
  );
};

export default Postres;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext.jsx";
import "../../../styles/Menu/AcompañantesCard.css";

const AcompañantesCard = ({ product, onUpdate, triggerEdit }) => {
  const [editing, setEditing] = useState(false);
  const [titulo, setTitulo] = useState(product.nombre);
  const [descripcion, setDescripcion] = useState(product.descripcion);
  const [precio, setPrecio] = useState(product.precio_actual);
  const [cantidad, setCantidad] = useState(1);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    if (triggerEdit) setEditing(true);
  }, [triggerEdit]);

  const handleGuardar = async () => {
    try {
      let updatedProduct = { nombre: titulo, descripcion, precio_actual: precio, estado: product.estado, subcategoria: product.subcategoria, imagen_url: product.imagen_url, id_categoria: product.id_categoria };
      if (file) {
        const formData = new FormData();
        formData.append("imagen", file);
        formData.append("nombre", titulo);
        formData.append("descripcion", descripcion);
        formData.append("precio_actual", precio);
        formData.append("estado", product.estado);
        formData.append("subcategoria", product.subcategoria);
        formData.append("id_categoria", product.id_categoria);

        const res = await axios.put(`http://localhost:3000/api/productos/${product.id_producto}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        updatedProduct = res.data;
      } else {
        const res = await axios.put(`http://localhost:3000/api/productos/${product.id_producto}`, updatedProduct);
        updatedProduct = res.data;
      }
      onUpdate(product.id_producto, updatedProduct);
      setEditing(false);
      setFile(null);
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("No se pudo guardar el producto");
    }
  };

  const agregarAlCarrito = async () => {
    if (!token) return alert("Debes iniciar sesión para agregar productos al carrito");

    try {
      setLoading(true);
      // Obtener carrito activo
      const { data: carrito } = await axios.get("http://localhost:3000/api/carrito/activo", { headers: { Authorization: `Bearer ${token}` } });
      if (!carrito?.id_carrito) throw new Error("No se pudo obtener carrito activo");

      // Agregar detalle
      await axios.post(
        "http://localhost:3000/api/detalle-carrito",
        { id_carrito: carrito.id_carrito, id_producto: product.id_producto, cantidad, subtotal: product.precio_actual },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.dispatchEvent(new Event("carritoActualizado"));
      alert("Producto agregado al carrito ✅");
    } catch (error) {
      console.error("Error al agregar al carrito:", error.response?.data || error);
      alert(error.response?.data?.message || "Error al agregar al carrito");
    } finally {
      setLoading(false);
    }
  };

  const incrementar = () => setCantidad(cantidad + 1);
  const decrementar = () => setCantidad(cantidad > 1 ? cantidad - 1 : 1);

  return (
    <div className="AcompañantesCard">
      {editing ? (
        <>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          <input type="number" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} />
          <div className="AcompañantesCard-actions">
            <button onClick={handleGuardar}>Guardar</button>
            <button onClick={() => setEditing(false)}>Cancelar</button>
          </div>
        </>
      ) : (
        <>
          <h3>{titulo}</h3>
          <img src={product.imagen_url ? `http://localhost:3000${product.imagen_url}` : "https://via.placeholder.com/120"} alt={titulo} />
          <p>{descripcion}</p>
          <div className="AcompañantesCard-quantity">
            <button onClick={decrementar}>-</button>
            <span>{cantidad}</span>
            <button onClick={incrementar}>+</button>
          </div>
          <button className="AcompañantesCard-add" onClick={agregarAlCarrito} disabled={loading}>{loading ? "Agregando..." : "Agregar al carrito"}</button>
          <p className="AcompañantesCard-price">Precio: ${precio}</p>
        </>
      )}
    </div>
  );
};

export default AcompañantesCard;

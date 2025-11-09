import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext.jsx";
import "../../../styles/Menu/KioscoCard.css";

const KioscoCard = ({ product, onUpdate, triggerEdit }) => {
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
      let updatedProduct = { 
        nombre: titulo,
        descripcion,
        precio_actual: precio,
        estado: product.estado,
        subcategoria: product.subcategoria,
        imagen_url: product.imagen_url,
        id_categoria: product.id_categoria 
      };

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
      const { data: carrito } = await axios.get("http://localhost:3000/api/carrito/activo", { headers: { Authorization: `Bearer ${token}` } });
      if (!carrito?.id_carrito) throw new Error("No se pudo obtener carrito activo");

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
    <div className="KioscoCard">
      {editing ? (
        <>
          <input className="KioscoCard-title-edit" type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <img className="KioscoCard-image" src={product.imagen_url ? `http://localhost:3000${product.imagen_url}` : "https://via.placeholder.com/120"} alt={titulo} />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <textarea className="KioscoCard-description-edit" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          <input className="KioscoCard-title-edit" type="number" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} />

          <div className="KioscoCard-actions">
            <button onClick={handleGuardar}>Guardar</button>
            <button onClick={() => setEditing(false)}>Cancelar</button>
          </div>
        </>
      ) : (
        <>
          <h3 className="KioscoCard-title">{titulo}</h3>
          <img className="KioscoCard-image" src={product.imagen_url ? `http://localhost:3000${product.imagen_url}` : "https://via.placeholder.com/120"} alt={titulo} />
          <p className="KioscoCard-description">{descripcion}</p>
          <div className="KioscoCard-quantity">
            <button onClick={decrementar}>-</button>
            <span>{cantidad}</span>
            <button onClick={incrementar}>+</button>
          </div>
          <p className="KioscoCard-price"><strong>Precio:</strong> ${precio}</p>
          <button className="KioscoCard-add" onClick={agregarAlCarrito} disabled={loading}>{loading ? "Agregando..." : "Agregar al carrito"}</button>
        </>
      )}
    </div>
  );
};

export default KioscoCard;

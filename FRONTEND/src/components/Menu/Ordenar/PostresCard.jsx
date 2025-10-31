import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../styles/Menu/PostresCard.css";

const PostresCard = ({ product, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [titulo, setTitulo] = useState(product.nombre);
  const [descripcion, setDescripcion] = useState(product.descripcion);
  const [precio, setPrecio] = useState(product.precio_actual);
  const [cantidad, setCantidad] = useState(1);
  const [file, setFile] = useState(null);

  // 🔹 Materias primas
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionadas, setSeleccionadas] = useState([]);

  // --- Cargar todas las materias primas disponibles ---
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/materia-prima")
      .then(res => setMateriasPrimas(res.data))
      .catch(err => console.error("Error al obtener materias primas:", err));
  }, []);

  // --- Cargar materias primas asignadas al producto cuando se edita ---
  useEffect(() => {
    if (editing) {
      axios
        .get(`http://localhost:3000/api/materia-prima/producto/${product.id_producto}/stock`)
        .then(res => {
          const asignadas = res.data.map(m => ({
            id_materia: m.id_materia,
            cantidad_necesaria: m.cantidad_necesaria || 1
          }));
          setSeleccionadas(asignadas);
        })
        .catch(err => console.error(err));
    }
  }, [editing]);

  // --- Toggle de selección ---
  const toggleMateriaPrima = (id_materia) => {
    setSeleccionadas(prev => {
      if (prev.some(m => m.id_materia === id_materia)) {
        return prev.filter(m => m.id_materia !== id_materia);
      } else {
        return [...prev, { id_materia, cantidad_necesaria: 1 }];
      }
    });
  };

  // --- Guardar materias primas en stock ---
  const guardarMateriasPrimas = async () => {
    if (!product.id_producto) {
      alert("ID de producto inválido");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/materia-prima/producto/${product.id_producto}/stock`,
        { materiasPrimas: seleccionadas }
      );
      alert("Materias primas guardadas correctamente ✅");
    } catch (error) {
      console.error("Error al guardar materias primas:", error);
      alert("Error al guardar materias primas ❌");
    }
  };

  // --- Código original de guardar producto ---
  const handleGuardar = async () => {
    try {
      let updatedProduct = {
        nombre: titulo,
        descripcion,
        precio_actual: precio,
        id_categoria: product.id_categoria,
        estado: product.estado,
        subcategoria: product.subcategoria,
        imagen_url: product.imagen_url,
      };

      if (file) {
        const formData = new FormData();
        formData.append("imagen", file);
        formData.append("nombre", titulo);
        formData.append("descripcion", descripcion);
        formData.append("precio_actual", precio);
        formData.append("id_categoria", product.id_categoria);
        formData.append("estado", product.estado);
        formData.append("subcategoria", product.subcategoria);

        const res = await axios.put(
          `http://localhost:3000/api/productos/${product.id_producto}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        updatedProduct = res.data;
      } else {
        const res = await axios.put(
          `http://localhost:3000/api/productos/${product.id_producto}`,
          updatedProduct
        );
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

  const handleDelete = () => {
    if (window.confirm("¿Eliminar este producto?")) onDelete(product.id_producto);
  };

  const agregarAlCarrito = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post("http://localhost:3000/api/detalle-carrito", {
        id_usuario: userId,
        id_producto: product.id_producto,
        cantidad,
      });
      alert("Producto agregado al carrito ✅");
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      alert("Error al agregar al carrito");
    }
  };

  const incrementar = () => setCantidad(cantidad + 1);
  const decrementar = () => setCantidad(cantidad > 1 ? cantidad - 1 : 1);

  // Filtrado de materias primas por búsqueda
  const materiasFiltradas = materiasPrimas.filter(mp =>
    mp.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="PostresCard-wrapper">
      <div className="PostresCard">
        {editing ? (
          <>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título"
              className="PostresCard-title-edit"
            />
            <img
              src={product.imagen_url ? `http://localhost:3000${product.imagen_url}` : "https://via.placeholder.com/120"}
              alt={titulo}
              className="PostresCard-image"
            />
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción"
              className="PostresCard-description-edit"
            />
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
              placeholder="Precio"
              className="PostresCard-title-edit"
            />

            {/* Materias primas */}
            <div className="PostresCard-materias">
              <h4>Materias primas</h4>
              <input
                type="text"
                placeholder="Buscar materia prima..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="MateriaPrimaSearch"
              />
              <div className="MateriasList">
                {materiasFiltradas.map(mp => (
                  <label key={mp.id_materia} className="MateriaPrimaItem">
                    <input
                      type="checkbox"
                      checked={seleccionadas.some(m => m.id_materia === mp.id_materia)}
                      onChange={() => toggleMateriaPrima(mp.id_materia)}
                    />
                    {mp.nombre}
                  </label>
                ))}
              </div>
              <button className="SaveButton" onClick={guardarMateriasPrimas}>
                Guardar Materias Primas
              </button>
            </div>

            <div className="PostresCard-actions">
              <button onClick={handleGuardar}>Guardar</button>
              <button onClick={() => setEditing(false)}>Cancelar</button>
            </div>
          </>
        ) : (
          <>
            <h3 className="PostresCard-title">{titulo}</h3>
            <img
              src={product.imagen_url ? `http://localhost:3000${product.imagen_url}` : "https://via.placeholder.com/120"}
              alt={titulo}
              className="PostresCard-image"
            />
            <p className="PostresCard-description">{descripcion}</p>
            <div className="PostresCard-quantity">
              <button onClick={decrementar}>-</button>
              <span>{cantidad}</span>
              <button onClick={incrementar}>+</button>
            </div>
            <button className="PostresCard-add" onClick={agregarAlCarrito}>
              Agregar al carrito
            </button>
            <p className="PostresCard-price">
              <strong>Precio:</strong> ${precio}
            </p>
          </>
        )}
      </div>

      {!editing && (
        <div className="PostresCard-editDelete">
          <button onClick={() => setEditing(true)}>Editar</button>
          <button onClick={handleDelete}>Eliminar</button>
        </div>
      )}
    </div>
  );
};

export default PostresCard;

import React, { useState } from 'react';
import '../../../styles/Menu/PostresCard.css';

const PostresCard = ({ product, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [titulo, setTitulo] = useState(product.title);
  const [descripcion, setDescripcion] = useState(product.description);
  const [imagen, setImagen] = useState(product.image);
  const [urlImagen, setUrlImagen] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [precio, setPrecio] = useState(product.price);

  // Subcategorías locales
  const subcategoriasEjemplo = [
    { id: 1, nombre: 'Torta' },
    { id: 2, nombre: 'Helado' },
    { id: 3, nombre: 'Galleta' },
    { id: 4, nombre: 'Postre frío' },
    { id: 5, nombre: 'Postre caliente' }
  ];
  const [subcategorias] = useState(subcategoriasEjemplo);

  const defaultSub = subcategoriasEjemplo.find(sc => sc.nombre === product.subcategoria)?.nombre || subcategoriasEjemplo[0].nombre;
  const [subcategoria, setSubcategoria] = useState(defaultSub);

  // Materias primas de ejemplo
  const materiasEjemplo = [
    'Harina', 'Azúcar', 'Huevos', 'Leche', 'Manteca',
    'Chocolate', 'Vainilla', 'Frutilla', 'Cacao', 'Crema'
  ];
  const [materiasPrimas] = useState(materiasEjemplo);
  const [selectedMaterias, setSelectedMaterias] = useState(product.materiasPrimas || []);
  const [searchMateria, setSearchMateria] = useState('');

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagen(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleMateria = (materia) => {
    setSelectedMaterias(prev =>
      prev.includes(materia)
        ? prev.filter(m => m !== materia)
        : [...prev, materia]
    );
  };

  const handleGuardar = () => {
    onUpdate(product.id, {
      title: titulo,
      description: descripcion,
      image: imagen,
      price: precio,
      subcategoria,
      materiasPrimas: selectedMaterias
    });
    setEditing(false);
  };

  const handleCancelar = () => setEditing(false);
  const handleDelete = () => {
    if (window.confirm('¿Eliminar este producto?')) onDelete(product.id);
  };
  const incrementar = () => setCantidad(cantidad + 1);
  const decrementar = () => setCantidad(cantidad > 0 ? cantidad - 1 : 0);

  // Filtrar materias según buscador
  const materiasFiltradas = materiasPrimas.filter(m =>
    m.toLowerCase().includes(searchMateria.toLowerCase())
  );

  return (
    <div className="PostresCard-wrapper">
      <div className="PostresCard">
        {editing ? (
          <>
            <input
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              className="PostresCard-title-edit"
              placeholder="Título"
              maxLength={50}
            />
            <img src={imagen} alt="Producto" className="PostresCard-image" />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <input
              type="text"
              placeholder="O pega URL"
              value={urlImagen}
              onChange={e => setUrlImagen(e.target.value)}
              onBlur={() => {
                if (urlImagen.trim() !== '') {
                  setImagen(urlImagen.trim());
                  setUrlImagen('');
                }
              }}
            />
            <div className="PostresCard-description-edit-container">
              <textarea
                className="PostresCard-description-edit"
                value={descripcion}
                onChange={e => {
                  if (e.target.value.length <= 200) setDescripcion(e.target.value);
                }}
                placeholder="Descripción (max 4 renglones)"
              />
            </div>
            <input
              type="number"
              className="PostresCard-title-edit"
              value={precio}
              onChange={e => setPrecio(Number(e.target.value))}
              placeholder="Precio"
              min="0"
            />

            {/* Select de subcategoría */}
            <select
              value={subcategoria}
              onChange={e => setSubcategoria(e.target.value)}
              className="PostresCard-title-edit"
            >
              {subcategorias.map(sc => (
                <option key={sc.id} value={sc.nombre}>
                  {sc.nombre}
                </option>
              ))}
            </select>

            {/* Materias primas */}
            <div className="PostresCard-materias">
              <h4>Seleccionar materias primas:</h4>
              <input
                type="text"
                placeholder="Buscar materia prima..."
                value={searchMateria}
                onChange={e => setSearchMateria(e.target.value)}
                className="materia-search"
              />
              <div className="materias-grid-scroll">
                {materiasFiltradas.map((m, idx) => (
                  <label key={idx} className="materia-item">
                    <input
                      type="checkbox"
                      checked={selectedMaterias.includes(m)}
                      onChange={() => toggleMateria(m)}
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>

            <div className="PostresCard-actions">
              <button onClick={handleGuardar}>Guardar</button>
              <button onClick={handleCancelar}>Cancelar</button>
            </div>
          </>
        ) : (
          <>
            <h3 className="PostresCard-title">{titulo}</h3>
            <img src={imagen} alt="Producto" className="PostresCard-image" />
            <div className="PostresCard-description-scroll">
              <p className="PostresCard-description" title={descripcion}>
                {descripcion}
              </p>

            </div>
            <div className="PostresCard-quantity">
              <button onClick={decrementar}>-</button>
              <span className="PostresCard-quantity-value">{cantidad}</span>
              <button onClick={incrementar}>+</button>
            </div>
            <button className="PostresCard-add">Agregar al carrito</button>
            <p className="PostresCard-price"><strong>Precio:</strong> ${precio}</p>
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

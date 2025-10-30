import React, { useState } from 'react';
import '../../../styles/Menu/KioscoCard.css';

const KioscoCard = ({ product, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [titulo, setTitulo] = useState(product.title);
  const [descripcion, setDescripcion] = useState(product.description);
  const [imagen, setImagen] = useState(product.image);
  const [urlImagen, setUrlImagen] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [precio, setPrecio] = useState(product.price);

  // Subcategorías locales
  const subcategoriasEjemplo = [
    { id: 1, nombre: 'Chocolates' },
    { id: 2, nombre: 'Golosinas' },
    { id: 3, nombre: 'Bebidas frías' },
    { id: 4, nombre: 'Snacks' }
  ];
  const [subcategorias] = useState(subcategoriasEjemplo);

  const defaultSub = subcategoriasEjemplo.find(sc => sc.nombre === product.subcategoria)?.nombre || subcategoriasEjemplo[0].nombre;
  const [subcategoria, setSubcategoria] = useState(defaultSub);

  // Materias primas de ejemplo
  const materiasEjemplo = [
    'Azúcar', 'Chocolate', 'Leche', 'Cacao', 'Caramelo',
    'Frutas', 'Harina', 'Sal', 'Aceite', 'Gomitas'
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

  const materiasFiltradas = materiasPrimas.filter(m =>
    m.toLowerCase().includes(searchMateria.toLowerCase())
  );

  return (
    <div className="KioscoCard-wrapper">
      <div className="KioscoCard">
        {editing ? (
          <>
            <input
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              className="KioscoCard-title-edit"
              placeholder="Título"
              maxLength={50}
            />
            <img src={imagen} alt="Producto" className="KioscoCard-image" />
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
            <div className="KioscoCard-description-edit-container">
              <textarea
                className="KioscoCard-description-edit"
                value={descripcion}
                onChange={e => {
                  if (e.target.value.length <= 200) setDescripcion(e.target.value);
                }}
                placeholder="Descripción (max 4 renglones)"
              />
            </div>
            <input
              type="number"
              className="KioscoCard-title-edit"
              value={precio}
              onChange={e => setPrecio(Number(e.target.value))}
              placeholder="Precio"
              min="0"
            />

            <select
              value={subcategoria}
              onChange={e => setSubcategoria(e.target.value)}
              className="KioscoCard-title-edit"
            >
              {subcategorias.map(sc => (
                <option key={sc.id} value={sc.nombre}>{sc.nombre}</option>
              ))}
            </select>

            <div className="KioscoCard-materias">
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

            <div className="KioscoCard-actions">
              <button onClick={handleGuardar}>Guardar</button>
              <button onClick={handleCancelar}>Cancelar</button>
            </div>
          </>
        ) : (
          <>
            <h3 className="KioscoCard-title">{titulo}</h3>
            <img src={imagen} alt="Producto" className="KioscoCard-image" />
            <div className="KioscoCard-description-scroll">
              <p className="KioscoCard-description" title={descripcion}>{descripcion}</p>
            </div>
            <div className="KioscoCard-quantity">
              <button onClick={decrementar}>-</button>
              <span className="KioscoCard-quantity-value">{cantidad}</span>
              <button onClick={incrementar}>+</button>
            </div>
            <button className="KioscoCard-add">Agregar al carrito</button>
            <p className="KioscoCard-price"><strong>Precio:</strong> ${precio}</p>
          </>
        )}
      </div>
      {!editing && (
        <div className="KioscoCard-editDelete">
          <button onClick={() => setEditing(true)}>Editar</button>
          <button onClick={handleDelete}>Eliminar</button>
        </div>
      )}
    </div>
  );
};

export default KioscoCard;

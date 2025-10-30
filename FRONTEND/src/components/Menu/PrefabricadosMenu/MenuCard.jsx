import React, { useState, useEffect } from 'react';
import './../../../styles/Menu/MenuCard.css';


const MenuCard = ({ menu, onAddToCart, onEdit, categories }) => {
  const [isEditing, setIsEditing] = useState(menu.editing || false);
  const [editedMenu, setEditedMenu] = useState({
    name: menu.name || '',
    imageUrl: menu.imageUrl || '',
    items: menu.items ? menu.items.join(', ') : '',
    price: menu.price || '',
    materias: menu.materias || []
  });

  const [selectedMaterias, setSelectedMaterias] = useState(menu.materiasPrimas || []);
  const [searchMateria, setSearchMateria] = useState('');

  useEffect(() => {
    setIsEditing(menu.editing || false);
  }, [menu.editing]);

  const handleSave = () => {
    const updatedMenu = {
      ...menu,
      name: editedMenu.name,
      imageUrl: editedMenu.imageUrl,
      items: editedMenu.items.split(',').map(i => i.trim()),
      price: editedMenu.price,
      materias: editedMenu.materias,
      materiasPrimas: selectedMaterias
    };
    onEdit(menu.id, updatedMenu);
    setIsEditing(false);
  };

  const handleFileChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedMenu(prev => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const toggleMateria = (materia) => {
    setSelectedMaterias(prev =>
      prev.includes(materia)
        ? prev.filter(m => m !== materia)
        : [...prev, materia]
    );
  };

  const placeholderImg = 'https://via.placeholder.com/150x150?text=Sin+imagen';

  // Filtrar materias primas según el buscador
  const materiasFiltradas = categories.filter(c =>
    c.nombre.toLowerCase().includes(searchMateria.toLowerCase())
  );

  return (
    <div className="menu-card">
      {isEditing ? (
        <>
          <input type="text" value={editedMenu.name} onChange={e => setEditedMenu({ ...editedMenu, name: e.target.value })} placeholder="Nombre del menú" />
          <input type="text" value={editedMenu.imageUrl} onChange={e => setEditedMenu({ ...editedMenu, imageUrl: e.target.value })} placeholder="URL de la imagen" />
          <input type="file" accept="image/*" onChange={e => handleFileChange(e.target.files[0])} />
          <textarea value={editedMenu.items} onChange={e => setEditedMenu({ ...editedMenu, items: e.target.value })} placeholder="Items separados por coma" />
          <input type="number" value={editedMenu.price} onChange={e => setEditedMenu({ ...editedMenu, price: e.target.value })} placeholder="Precio" />


          {/* Buscador de materias primas */}
          <div className="menu-materias-primas">
            <h4>Seleccionar materias primas:</h4>
            <input
              type="text"
              placeholder="Buscar materia prima..."
              value={searchMateria}
              onChange={e => setSearchMateria(e.target.value)}
              className="materia-search"
            />
            <div className="materias-grid-scroll">
              {materiasFiltradas.map((materia, idx) => (
                <label key={idx} className="materia-item">
                  <input
                    type="checkbox"
                    checked={selectedMaterias.includes(materia.nombre)}
                    onChange={() => toggleMateria(materia.nombre)}
                  />
                  {materia.nombre}
                </label>
              ))}
            </div>
          </div>

          <div className="menu-actions">
            <button onClick={handleSave}>Guardar</button>
            <button onClick={() => setIsEditing(false)}>Cancelar</button>
          </div>
        </>
      ) : (
        <>
          <h3>{menu.name}</h3>
          <img src={menu.imageUrl || placeholderImg} alt={menu.name} className="menu-image" />
          <div className="menu-details-white">
            <p>Este menú contiene:</p>
            <div className="menu-items-scroll">
              <ul>
                {menu.items.length ? menu.items.map((i, idx) => <li key={idx}>{i}</li>) : <li>No hay ítems</li>}
              </ul>
            </div>
          </div>
          <button onClick={() => onAddToCart(menu.id)} className="add-menu">Agregar al carrito</button>
          {menu.price && <p className="menu-price">Precio: ${menu.price}</p>}
        </>
      )}
    </div>
  );
};

export default MenuCard;

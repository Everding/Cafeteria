import React, { useState } from 'react';
import MenuCard from './MenuCard';
import './../../../styles/Menu/Menu.css';

const MenuList = () => {
  const [menus, setMenus] = useState([
    { id: 1, name: 'Menú 1', imageUrl: '', items: ['Item A', 'Item B'], price: 100, category: 'Bebidas' },
    { id: 2, name: 'Menú 2', imageUrl: '', items: ['Item C'], price: 150, category: 'Postres' },
    { id: 3, name: 'Menú 3', imageUrl: '', items: ['Item D', 'Item E', 'Item F'], price: 200, category: 'Kiosco' },
  ]);

  const [categories] = useState([
{ id: 1, nombre: 'Leche' },
  { id: 2, nombre: 'Café' },
  { id: 3, nombre: 'Azúcar' },
  { id: 4, nombre: 'Chocolate' },
  { id: 5, nombre: 'Vainilla' },
  { id: 6, nombre: 'Miel' },
  { id: 7, nombre: 'Crema' },
  { id: 8, nombre: 'Frutilla' },
  { id: 9, nombre: 'Plátano' },
  { id: 10, nombre: 'Caramelo' },
  ]);

  const agregarMenu = () => {
    const newMenu = {
      id: Date.now(),
      name: 'Nuevo Menú',
      imageUrl: '',
      items: ['Item 1', 'Item 2'],
      price: 0,
      category: ''
    };
    setMenus([newMenu, ...menus]);
  };

  const handleEdit = (id, updatedMenu) => {
    setMenus(menus.map(menu => menu.id === id ? { ...updatedMenu, editing: false } : menu));
  };

  const handleAddToCart = (id) => console.log(`Menú ${id} agregado al carrito`);

  const handleDelete = (id) => setMenus(menus.filter(menu => menu.id !== id));

  const handleCancel = (id) => setMenus(menus.map(menu => menu.id === id ? { ...menu, editing: false } : menu));

  return (
    <div className='menu-list'>
      <div className='menu-list-header' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
        <h1>Menús</h1>
        <button onClick={agregarMenu} className='add-menuPage'>Agregar Menú</button>
      </div>

      <div className="menu-container">
        {menus.map(menu => (
          <div key={menu.id} className="menu-wrapper">
            <MenuCard
              menu={menu}
              onAddToCart={handleAddToCart}
              onEdit={handleEdit}
              onCancel={handleCancel}
              categories={categories}
            />
            {!menu.editing && (
              <div className="menu-buttons">
                <button onClick={() => setMenus(menus.map(m => m.id === menu.id ? { ...m, editing: true } : m))}>
                  Editar
                </button>
                <button onClick={() => handleDelete(menu.id)}>Eliminar</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuList;

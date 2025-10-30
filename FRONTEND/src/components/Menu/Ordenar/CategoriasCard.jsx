import React from 'react';
import '../../../styles/Menu/CategoriasCard.css';

const CategoriasCard = ({ name, path, image }) => {
  return (
    <a href={path} className="category-link">
      <div className="category-card">
        <div className="category-image-container">
          <img src={image} alt={name} className="category-image" />
        </div>
        <span className="category-name">{name}</span>
      </div>
    </a>
  );
};

export default CategoriasCard;

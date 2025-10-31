import React from "react";
import "../../styles/Nosotros/Sucursales.css";

const Sucursales = () => {
  const sucursales = [
    {
      id: 1,
      nombre: "Sucursal 2",
      direccion: "Av. San Martín 1234, San Miguel de Tucumán",
      horario: "Lunes a Domingo: 8:00 - 22:00",
      telefono: "+54 381 456-7890",
      imagen: "https://www.locaties.nl/media/z34hrqnm/grandcafe-fizz002.jpg",
      mapa: "https://www.google.com/maps?q=Av.+San+Martín+1234,+San+Miguel+de+Tucumán&output=embed",
    },
    {
      id: 2,
      nombre: "Sucursal 1",
      direccion: "Av. Belgrano 2500, Yerba Buena",
      horario: "Lunes a Domingo: 9:00 - 23:00",
      telefono: "+54 381 321-6547",
      imagen: "https://zleeuwarden.nl/wp-content/uploads/2024/02/GrandCafeFIZZ001.jpg",
      mapa: "https://www.google.com/maps?q=Av.+Belgrano+2500,+Yerba+Buena&output=embed",
    },
  ];

  return (
    <div className="sucursales-container">
      <h2 className="titulo-sucursales">NUESTRAS SUCURSALES</h2>

      {sucursales.map((sucursal, index) => (
        <div
          key={sucursal.id}
          className={`sucursal-card ${
            index % 2 === 0 ? "imagen-izquierda" : "imagen-derecha"
          }`}
        >
          <img
            src={sucursal.imagen}
            alt={sucursal.nombre}
            className="sucursal-imagen"
          />
          <div className="sucursal-info">
            <h3>{sucursal.nombre}</h3>
            <p>
              <strong>Dirección:</strong> {sucursal.direccion}
            </p>
            <p>
              <strong>Horario:</strong> {sucursal.horario}
            </p>
            <p>
              <strong>Teléfono:</strong> {sucursal.telefono}
            </p>

            <div className="mapa-container">
              <iframe
                src={sucursal.mapa}
                title={sucursal.nombre}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>

            <a
              href={sucursal.mapa.replace("&output=embed", "")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-mapa"
            >
              Ver en Google Maps
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sucursales;

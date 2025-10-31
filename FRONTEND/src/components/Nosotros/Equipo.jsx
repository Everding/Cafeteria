import React from "react";
import "../../styles/Nosotros/Equipo.css";

const Equipo = () => {
  const encargados = [
    {
      id: 1,
      nombre: "Laura Fernández",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Encargada general. Supervisa todas las áreas del local y asegura un servicio de calidad.",
    },
    {
      id: 2,
      nombre: "Carlos Gómez",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Encargado de cocina. Coordina al equipo culinario y mantiene los estándares de sabor y presentación.",
    },
    {
      id: 3,
      nombre: "Mariana Ríos",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Encargada de atención al cliente. Se asegura de que cada cliente tenga una excelente experiencia.",
    },
    {
      id: 4,
      nombre: "Ricardo Díaz",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Encargado de stock. Controla inventarios y abastecimiento del establecimiento.",
    },
    {
      id: 5,
      nombre: "Natalia Ruiz",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Encargada de caja. Responsable de la gestión de cobros y balances diarios.",
    },
    {
      id: 6,
      nombre: "Esteban López",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Encargado de mantenimiento. Garantiza el correcto funcionamiento de los equipos e instalaciones.",
    },
    {
      id: 7,
      nombre: "Valeria Soto",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Encargada de marketing. Diseña estrategias para mejorar la visibilidad del local.",
    },
    {
      id: 8,
      nombre: "Julián Pérez",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Encargado de recursos humanos. Se encarga de la organización y bienestar del personal.",
    },
  ];

  const empleados = [
    {
      id: 1,
      nombre: "Lucía Torres",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Barista experta en cafés artesanales.",
    },
    {
      id: 2,
      nombre: "Matías Cabrera",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Cocinero especializado en postres y panadería.",
    },
    {
      id: 3,
      nombre: "Sofía Morales",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Atención al cliente con una sonrisa siempre.",
    },
    {
      id: 4,
      nombre: "Tomás Herrera",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Encargado de limpieza y mantenimiento del área común.",
    },
    {
      id: 5,
      nombre: "Camila Navarro",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Ayudante de cocina. Apoya en la preparación de platos.",
    },
    {
      id: 6,
      nombre: "Felipe Acosta",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Cajero, responsable del manejo de pedidos y cobros.",
    },
    {
      id: 7,
      nombre: "Milena Rodríguez",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Encargada de empaque y pedidos para llevar.",
    },
    {
      id: 8,
      nombre: "Pablo Vega",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Cocinero especializado en comidas rápidas.",
    },
    {
      id: 9,
      nombre: "Daniela Ortiz",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Mesera con atención cálida y eficiente.",
    },
    {
      id: 10,
      nombre: "Ignacio Silva",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Ayudante de barista y limpieza.",
    },
    {
      id: 11,
      nombre: "Martina Romero",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Encargada de recepción y reservas.",
    },
    {
      id: 12,
      nombre: "Nicolás Figueroa",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Personal de mantenimiento técnico.",
    },
    {
      id: 13,
      nombre: "Julieta Guzmán",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Cocinera auxiliar en el área de pastelería.",
    },
    {
      id: 14,
      nombre: "Ramiro Paredes",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Asistente de cocina y limpieza de utensilios.",
    },
    {
      id: 15,
      nombre: "Carolina Vázquez",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Atención al cliente en mostrador.",
    },
    {
      id: 16,
      nombre: "Lucas Fernández",
      imagen: "https://via.placeholder.com/150",
      descripcion: "Personal de apoyo general en eventos y horarios pico.",
    },
  ];

  return (
<div className="equipo-container">
  <h2 id="Titulo-equipo">Nuestro Equipo</h2>

  {/* Encargados */}
  <div className="linea-titulo">
    <h3>Encargados</h3>
  </div>
  <div className="fila-equipo">
    {encargados.map(e => (
      <div className="equipo-card" key={e.id}>
        <img src={e.imagen} alt={e.nombre} className="equipo-img" />
        <h4>{e.nombre}</h4>
        <p>{e.descripcion}</p>
      </div>
    ))}
  </div>

  {/* Empleados */}
  <div className="linea-titulo">
    <h3>Empleados</h3>
  </div>
  <div className="fila-equipo">
    {empleados.map(e => (
      <div className="equipo-card" key={e.id}>
        <img src={e.imagen} alt={e.nombre} className="equipo-img" />
        <h4>{e.nombre}</h4>
        <p>{e.descripcion}</p>
      </div>
    ))}
  </div>
</div>
  );
};

export default Equipo;

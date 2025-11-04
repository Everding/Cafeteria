import React from "react";
import Carrito from "../components/Carrito";
import Footer from "../components/Footer";

const CarritoPage = () => {
  return (
    <div>
      {/* 👇 Pasás el ID del carrito (por ahora fijo para pruebas) */}
      <Carrito idCarrito={1} />
      <Footer />
    </div>
  );
};

export default CarritoPage;

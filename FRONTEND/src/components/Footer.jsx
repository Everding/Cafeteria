import React from 'react'
import '../styles/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3 className="footer-title">Cafetería Promedio</h3>
        <p className="footer-text">
          Tu rincón favorito para disfrutar de un café promedio y una compañía promedio.
        </p>

        <div className="footer-links">
          <a href="#home">Inicio</a>
          <a href="#menu">Menú</a>
          <a href="#contacto">Contacto</a>
          <a href="#nosotros">Nosotros</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Cafetería Promedio — Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer

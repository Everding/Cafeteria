import React from 'react'
import '../styles/Footer.css'
import { FaInstagram, FaFacebook, FaXTwitter, FaWhatsapp } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3 className="footer-title">Cafetería Promedio</h3>
        <p className="footer-text">
          Tu rincón favorito para disfrutar de un café promedio y una compañía promedio.
        </p>


<div className="footer-links">
  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
    <FaInstagram size={24} />
  </a>
  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
    <FaFacebook size={24} />
  </a>
  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
    <FaXTwitter size={24} />
  </a>
  <a href="https://wa.me/XXXXXXXXXXX" target="_blank" rel="noopener noreferrer">
    <FaWhatsapp size={24} />
  </a>
</div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Cafetería Promedio — Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer

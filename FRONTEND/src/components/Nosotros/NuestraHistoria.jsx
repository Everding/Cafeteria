import React from "react";
import "../../styles/Nosotros/Historia.css";

const NuestraHistoria = () => {
  return (
    <div className="primer-div">
      <h2 id="Titulo">Nuestra Historia</h2>

      <div className="Parrafo-imagenizquierda">
        <img
          src="https://images.unsplash.com/photo-1509042239860-f550ce710b93"
          alt="Inicios de la cafetería"
          className="imagen"
        />
        <p className="parrafo">
          Todo comenzó en 2008, cuando un pequeño grupo de amigos decidió abrir
          un rincón donde el aroma del café recién molido y las risas se
          mezclaran con la calidez del hogar. Con apenas unas pocas mesas, un
          viejo molinillo y muchas ganas, nació lo que hoy conocemos como
          <strong> nuestra cafetería </strong>.
        </p>
      </div>
      <div className="Parrafo-imagenderecha">
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
          alt="Crecimiento del local"
          className="imagen"
        />
        <p className="parrafo">
          Con el paso de los años, fuimos creciendo junto a nuestra comunidad.
          Cada cliente que llegaba con una historia, una sonrisa o simplemente
          buscando un momento de calma, se convirtió en parte de esta gran
          familia. El menú se amplió, el equipo creció, pero la esencia siguió
          siendo la misma: <em>servir con pasión</em>.
        </p>
      </div>
      <div className="Parrafo-imagenizquierda">
        <img
          src="https://images.unsplash.com/photo-1521017432531-fbd92d768814"
          alt="Equipo trabajando"
          className="imagen"
        />
        <p className="parrafo">
          Detrás de cada taza hay manos dedicadas, risas compartidas y una
          historia que se escribe día a día. Nuestro equipo, formado por
          encargados y empleados comprometidos, es el alma de este lugar. Su
          esfuerzo y amor por lo que hacen son lo que mantiene vivo este
          proyecto.
        </p>
      </div>
      <div className="Parrafo-imagenderecha">
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
          alt="Ambiente actual"
          className="imagen"
        />
        <p className="parrafo">
          Hoy, con más de una década de historia, seguimos apostando a la
          cercanía, la calidad y el compromiso. Nuestro objetivo es que cada
          persona que cruce nuestras puertas se lleve un momento especial, un
          recuerdo cálido y las ganas de volver.
        </p>
      </div>
      <div className="final-historia">
        <h3>"Más que un café, un encuentro de historias."</h3>
      </div>
    </div>
  );
};

export default NuestraHistoria;

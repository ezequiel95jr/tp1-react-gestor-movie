import Button from "../Button/Button";
import { useState } from "react";
import Form from "../Form/Form";
import style from "./Card.module.css";
import StarRating from "../StarRating/StarRating";

const Card = ({ pelicula, onEliminar, onModificar, onMarcarVista, vista }) => {
  const [modoEdicion, setModoEdicion] = useState(false);

  const aceptarEdicion = () => setModoEdicion(false);

  return (
    <div className={`${style.card} ${vista ? style.vista : ""}`}>
      {modoEdicion ? (
        <Form
          pelicula={pelicula}
          onSubmit={() => {}}
          onChange={(e) =>
            onModificar({ ...pelicula, [e.target.name]: e.target.value })
          }
          modoEdicion={true}
        />
      ) : (
        <>
          <div className={style.boxcard}>
          <img
            className={style.imagen}
            src={`https://picsum.photos/200/300?random=${pelicula.id}`}
            alt={pelicula.titulo}
          />

          <div className={style.info}>
            <h3>{pelicula.titulo}</h3>
            <p><strong>Género:</strong> {pelicula.genero}</p>
            <p><strong>Tipo:</strong> {pelicula.tipo}</p>
            <p><strong>Año:</strong> {pelicula.año}</p>
            <p><strong>Director:</strong> {pelicula.director}</p>
            <p><strong>Rating:</strong></p><StarRating
          value={pelicula.rating}
          onChange={(newRating) =>
            onChange({ target: { name: "rating", value: newRating } })
          }
          editable={false}
        />
          </div>
          </div>
        </>
      )}

      <div className={style.botones}>
        <Button onClick={() => onEliminar(pelicula)}>Eliminar</Button>
        {modoEdicion ? (
          <Button onClick={aceptarEdicion}>Aceptar</Button>
        ) : (
          <Button onClick={() => setModoEdicion(true)}>Editar</Button>
        )}
        <Button onClick={() => onMarcarVista(pelicula)}>
          {vista ? "Quitar de Vistas" : "Marcar como Vista"}
        </Button>
      </div>
    </div>
  );
};

export default Card;

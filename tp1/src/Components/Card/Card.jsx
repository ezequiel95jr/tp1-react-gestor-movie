import Button from "../Button/Button";
import { useState } from "react";
import Form from "../Form/Form";
import style from "./Card.module.css";

const Card = ({ pelicula, onEliminar, onModificar, onMarcarVista }) => {
  const [modoEdicion, setModoEdicion] = useState(false);

  const cancelarEdicion = () => {
    setModoEdicion(false); 
  };

  return (
    <div className={style.card}>
      {modoEdicion ? (
        <Form
          pelicula={pelicula}
          onSubmit={() => {}} 
          onChange={(e) => onModificar({ ...pelicula, [e.target.name]: e.target.value })} 
        />
      ) : (
        <>
          <h3>{pelicula.titulo}</h3>
          <p>Género: {pelicula.genero}</p>
          <p>Tipo: {pelicula.tipo}</p>
          <p>Año: {pelicula.año}</p>
          <p>Director: {pelicula.director}</p>
          <p>Rating: {pelicula.rating}</p>
        </>
      )}

      <div className="card-buttons">
        <Button onClick={() => onEliminar(pelicula)}>Eliminar</Button>
        {modoEdicion ? (
          <Button texto="Cancelar" onClick={cancelarEdicion} />
        ) : (
          <Button onClick={() => setModoEdicion(true)}>Editar</Button>
        )}
        <Button onClick={() => onMarcarVista(pelicula)}>Vista</Button>
      </div>
    </div>
  );
};

export default Card;

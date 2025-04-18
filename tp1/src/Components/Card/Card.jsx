import "./Card.css";
import Button from "../Button/Button";
import { useState } from "react";
import Form from "../Form/Form";

const Card = ({ pelicula, onEliminar, onModificar, onMarcarVista }) => {
  const [modoEdicion, setModoEdicion] = useState(false);

  const cancelarEdicion = () => {
    setModoEdicion(false); 
  };

  return (
    <div className="card">
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
        <Button texto="Eliminar" onClick={() => onEliminar(pelicula)} />
        {modoEdicion ? (
          <Button texto="Cancelar" onClick={cancelarEdicion} />
        ) : (
          <Button texto="Modificar" onClick={() => setModoEdicion(true)} />
        )}
        <Button texto="Vista" onClick={() => onMarcarVista(pelicula)} />
      </div>
    </div>
  );
};

export default Card;

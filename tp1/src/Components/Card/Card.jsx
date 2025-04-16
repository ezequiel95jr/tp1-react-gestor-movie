import "./Card.css";
import Button from "../Button/Button";
import { useState } from "react";

const Card = ({ pelicula, onEliminar, onModificar, onMarcarVista }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [datosEditados, setDatosEditados] = useState({ ...pelicula });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosEditados((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const guardarCambios = () => {
    const datosEditadosConRatingCorrecto = {
      ...datosEditados,
      rating: Number(datosEditados.rating),
    };
    onModificar(datosEditadosConRatingCorrecto);
    setModoEdicion(false);
  };

  return (
    <div className="card">
      {modoEdicion ? (
        <>
          <input
            type="text"
            name="titulo"
            value={datosEditados.titulo}
            onChange={handleChange}
          />
          <input
            type="text"
            name="genero"
            value={datosEditados.genero}
            onChange={handleChange}
          />
          <input
            type="text"
            name="año"
            value={datosEditados.año}
            onChange={handleChange}
          />
          <input
            type="text"
            name="director"
            value={datosEditados.director}
            onChange={handleChange}
          />
          <input
            type="number"
            name="rating"
            value={datosEditados.rating}
            onChange={handleChange}
          />
        </>
      ) : (
        <>
          <h3>{pelicula.titulo}</h3>
          <p>Genero: {pelicula.genero}</p>
          <p>Año: {pelicula.año}</p>
          <p>Director: {pelicula.director}</p>
          <p>Rating: {pelicula.rating}</p>
        </>
      )}

      <div className="card-buttons">
        <Button texto="Eliminar" onClick={() => onEliminar(pelicula.id)} />
        {modoEdicion ? (
          <Button texto="Guardar" onClick={guardarCambios} />
        ) : (
          <Button texto="Modificar" onClick={() => setModoEdicion(true)} />
        )}
        <Button texto="Vista" onClick={() => onMarcarVista(pelicula)} />
      </div>
    </div>
  );
};

export default Card;

import "./Card.css";
import Button from "../Button/Button";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    if (modoEdicion) {
      const datosConRatingNumerico = {
        ...datosEditados,
        rating: Number(datosEditados.rating),
      };
      onModificar(datosConRatingNumerico);
    }
  }, [datosEditados, modoEdicion]);

  const cancelarEdicion = () => {
    setDatosEditados({ ...pelicula });
    setModoEdicion(false);
  };

  const generarOpcionesAño = () => {
    const opciones = [];
    for (let año = 1895; año <= 2025; año++) {
      opciones.push(
        <option key={año} value={año}>
          {año}
        </option>
      );
    }
    return opciones;
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
          <select
            name="genero"
            value={datosEditados.genero}
            onChange={handleChange}
          >
            <option value="">Seleccionar género</option>
            <option value="Acción">Acción</option>
            <option value="Comedia">Comedia</option>
            <option value="Drama">Drama</option>
            <option value="Terror">Terror</option>
            <option value="Ciencia ficción">Ciencia ficción</option>
            <option value="Romance">Romance</option>
          </select>
          <select
            name="tipo"
            value={datosEditados.tipo}
            onChange={handleChange}
          >
            <option value="">Seleccionar tipo</option>
            <option value="Película">Película</option>
            <option value="Serie">Serie</option>
          </select>
          <select
            name="año"
            value={datosEditados.año}
            onChange={handleChange}
          >
            <option value="">Seleccionar año</option>
            {generarOpcionesAño()}
          </select>
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
          <p>Género: {pelicula.genero}</p>
          <p>Tipo: {pelicula.tipo}</p>
          <p>Año: {pelicula.año}</p>
          <p>Director: {pelicula.director}</p>
          <p>Rating: {pelicula.rating}</p>
        </>
      )}

      <div className="card-buttons">
        <Button texto="Eliminar" onClick={() => onEliminar(pelicula.id)} />
        {modoEdicion ? (
          <Button texto="Aceptar" onClick={cancelarEdicion} />
        ) : (
          <Button texto="Modificar" onClick={() => setModoEdicion(true)} />
        )}
        <Button texto="Vista" onClick={() => onMarcarVista(pelicula)} />
      </div>
    </div>
  );
};

export default Card;

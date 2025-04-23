import { useState } from "react";
import Button from "../Button/Button";
import { Trash2, Pencil, Eye, EyeOff } from "lucide-react";
import Form from "../Form/Form";
import style from "./Card.module.css";

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
            <p><strong>Rating:</strong> {pelicula.rating}/5</p>
          </div>
          </div>
        </>
      )}

      <div className={style.botones}>
        <Button onClick={() => onEliminar(pelicula)} className={style.iconButton}>
        <Trash2 color="red" size={20} />
        </Button>
        {modoEdicion ? (
          <Button onClick={aceptarEdicion} className={style.iconButton}>
            <Pencil size={20} />
          </Button>
        ) : (
          <Button onClick={() => setModoEdicion(true) }className={style.iconButton}>
            <Pencil size={20} />
          </Button>
        )}
        <Button onClick={() => onMarcarVista(pelicula)}className={style.iconButton}>
          {vista ? <EyeOff size={20} /> : <Eye size={20} />}
        </Button>
      </div>
    </div>
  );
};

export default Card;

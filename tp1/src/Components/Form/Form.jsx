import style from "./Form.module.css";
import fondoForm from "../../assets/images/mike.png";
import Button from "../Button/Button";
import StarRating from "../StarRating/StarRating";


const Form = ({ pelicula, onSubmit, onChange,modoEdicion = false }) => {
  const handleChange = (e) => {
  onChange(e);
    };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Enviando formulario", pelicula);
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={style.form}>
      <h2>Agregar Película</h2>
      <input
        type="text"
        name="titulo"
        value={pelicula.titulo}
        onChange={handleChange}
      />
      <select name="genero" value={pelicula.genero} onChange={handleChange}>
        <option value="">Seleccionar género</option>
        <option value="Acción">Acción</option>
        <option value="Comedia">Comedia</option>
        <option value="Drama">Drama</option>
        <option value="Terror">Terror</option>
        <option value="Ciencia ficción">Ciencia ficción</option>
        <option value="Romance">Romance</option>
      </select>
      <select name="tipo" value={pelicula.tipo} onChange={handleChange}>
        <option value="">Seleccionar tipo</option>
        <option value="Película">Película</option>
        <option value="Serie">Serie</option>
      </select>
      <input
        type="number"
        name="año"
        min="1895"
        max={new Date().getFullYear()}
        placeholder="Año"
        value={pelicula.año}
        onChange={handleChange}
      />
{/* Aca podrian reutilizar el componente input que tienen */}
      <input
        placeholder="Director"
        type="text"
        name="director"
        value={pelicula.director}
        onChange={handleChange}
      />
      <div className={style.ratingContainer}>
        <label>Rating:</label>
        <StarRating
          value={pelicula.rating}
          onChange={(newRating) =>
            onChange({ target: { name: "rating", value: newRating } })
          }
        />
      </div>
          <div className={style.checkboxContainer}>
          <label>
            <input
              type="checkbox"
              name="vista"
              checked={pelicula.vista || false}
              onChange={(e) =>
                onChange({
                  target: { name: "vista", value: e.target.checked }
                })
              }
            />
            Vista
          </label>
        </div>
      {!modoEdicion && <button type="submit">Agregar</button>}
          </form>
  );
};

export default Form;

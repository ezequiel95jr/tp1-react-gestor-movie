import style from "./Form.module.css";  
import fondoForm from "../../assets/images/mike.png";
import Button from "../Button/Button";
import StarRating from "../StarRating/StarRating";
const Form = ({ pelicula, onSubmit, onChange }) => {
  const handleChange = (e) => {
    onChange(e); 
  };

  const generarOpcionesAño = () => {
    const opciones = [];
    for (let año = 1895; año <= 2025; año++) {
      opciones.push(
        <option key={año} value={String(año)}>
          {año}
        </option>
      );
    }
    return opciones;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(); 
  };

  return (
    <form onSubmit={handleSubmit} className={style.form}>
      <h2>Agregar Película</h2>
      <input
        type="text" name="titulo" value={pelicula.titulo} onChange={handleChange} />
      <select
        name="genero"
        value={pelicula.genero}
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
        value={pelicula.tipo}
        onChange={handleChange}
      >
        <option value="" inert >Seleccionar tipo</option>
        <option value="Película">Película</option>
        <option value="Serie">Serie</option>
      </select>
      <select
        name="año"
        value={pelicula.año}
        onChange={handleChange}
      >
        <option value="">Seleccionar año</option>
        {generarOpcionesAño()}
      </select>
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
    <Button type="submit">Agregar</Button>
    </form>
  );
};

export default Form;

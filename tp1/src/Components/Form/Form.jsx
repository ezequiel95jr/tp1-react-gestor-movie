import './Form.css';
import '../Button/Button.jsx';
import Button from '../Button/Button.jsx';
import { useState } from 'react';   

const Form = ({ onSubmit, onChange, pelicula }) => {

 const [nuevaPelicula, setNuevaPelicula] = useState({
    titulo: "",
    genero: "",
    tipo: "",
    año: "",
    director: "",
    rating: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarPelicula(nuevaPelicula);  
    setNuevaPelicula({ titulo: "", genero: "", tipo: "", año: "", director: "", rating: 0 });  
  };





  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="titulo">Titulo</label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={pelicula.titulo}
          onChange={onChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="genero">Género</label>
        <input
          type="text"
          id="genero"
          name="genero"
          value={pelicula.genero}
          onChange={onChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="tipo">Tipo</label>
        <input
          type="text"
          id="tipo"
          name="tipo"
          value={pelicula.tipo}
          onChange={onChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="año">Año</label>
        <input
          type="number"
          id="año"
          name="año"
          value={pelicula.año}
          onChange={onChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="director">Director</label>
        <input
          type="text"
          id="director"
          name="director"
          value={pelicula.director}
          onChange={onChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="rating">Rating</label>
        <input
          type="number"
          id="rating"
          name="rating"
          value={pelicula.rating}
          onChange={onChange}
          required
        />
      </div>
      <Button type='submit'>Agregar pelicula</Button>
    </form>
  );
}

export default Form;   
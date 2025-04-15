import './Form.css';
import Button from '../Button/Button.jsx';
 

const Form = ({ onSubmit, onChange, pelicula }) => {

 

  const handleSubmit = (e) => {
    e.preventDefault();
    onsubmit();  
  };





  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="titulo">Titulo</label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          className='input'
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
          className='input'
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
          className='input'
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
          className='input'
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
          className='input'
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
          className='input'
          value={pelicula.rating}
          onChange={onChange}
          required
        />
      </div>
      <Button texto="Agregar pelicula" type='submit'></Button>
    </form>
  );
}

export default Form;   
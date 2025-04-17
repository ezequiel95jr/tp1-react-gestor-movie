const Form = ({ onSubmit, onChange, pelicula }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <label>
        Título:
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={pelicula.titulo}
          onChange={onChange}
          required
        />
      </label>

      <label>
        Género:
        <input
          type="text"
          name="genero"
          placeholder="Género"
          value={pelicula.genero}
          onChange={onChange}
          required
        />
      </label>

      <label>
        Tipo:
        <input
          type="text"
          name="tipo"
          placeholder="Tipo"
          value={pelicula.tipo}
          onChange={onChange}
          required
        />
      </label>

      <label>
        Año:
        <input
          type="text"
          name="año"
          placeholder="Año"
          value={pelicula.año}
          onChange={onChange}
          required
        />
      </label>

      <label>
        Director:
        <input
          type="text"
          name="director"
          placeholder="Director"
          value={pelicula.director}
          onChange={onChange}
          required
        />
      </label>

      <label>
        Rating:
        <input
          type="number"
          name="rating"
          placeholder="Rating"
          value={pelicula.rating}
          onChange={onChange}
          required
        />
      </label>

      <button type="submit">Agregar</button>
    </form>
  );
};

export default Form;

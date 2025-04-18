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
  <select
    name="genero"
    value={pelicula.genero}
    onChange={onChange}
    required
  >
    <option value="">Seleccionar género</option>
    <option value="Acción">Acción</option>
    <option value="Comedia">Comedia</option>
    <option value="Drama">Drama</option>
    <option value="Terror">Terror</option>
    <option value="Ciencia ficción">Ciencia ficción</option>
    <option value="Romance">Romance</option>
  </select>
</label>

      <label>
        Tipo:
        <select
          name="tipo"
          value={pelicula.tipo}
          onChange={onChange}
          required
        >
          <option value="">Seleccionar tipo</option>
          <option value="Película">Película</option>
          <option value="Serie">Serie</option>
        </select>
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

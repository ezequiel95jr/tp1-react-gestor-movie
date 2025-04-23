import React, { useState, useEffect } from 'react';
import Select from '../Select/Select';
import styles from './Filtro.module.css';

const Filtros = ({ peliculas, peliculasVistas, setPeliculasFiltradas, setPeliculasVistasFiltradas }) => {
  const [filtroGenero, setFiltroGenero] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [orden, setOrden] = useState('');

  const ordenamientos = {
    añoAsc: (a, b) => a.año - b.año,
    añoDesc: (a, b) => b.año - a.año,
    ratingAsc: (a, b) => a.rating - b.rating,
    ratingDesc: (a, b) => b.rating - a.rating,
  };

  const filtrar = (lista) => {
    let resultado = [...lista];

    if (filtroGenero) {
      resultado = resultado.filter((p) => p.genero === filtroGenero);
    }

    if (filtroTipo) {
      resultado = resultado.filter((p) => p.tipo === filtroTipo);
    }

    if (orden && ordenamientos[orden]) {
      resultado.sort(ordenamientos[orden]);
    }

    return resultado;
  };

  useEffect(() => {
    setPeliculasFiltradas(filtrar(peliculas));
    setPeliculasVistasFiltradas(filtrar(peliculasVistas));
  }, [filtroGenero, filtroTipo, orden, peliculas, peliculasVistas]);

  return (
    <div className={styles.filtros}>
      <Select
        label="Género"
        name="genero"
        value={filtroGenero}
        onChange={(e) => setFiltroGenero(e.target.value)}
        options={[
          { value: '', label: 'Todos los géneros' },
          { value: 'Acción', label: 'Acción' },
          { value: 'Comedia', label: 'Comedia' },
          { value: 'Drama', label: 'Drama' },
          { value: 'Terror', label: 'Terror' },
          { value: 'Ciencia ficción', label: 'Ciencia ficción' },
          { value: 'Romance', label: 'Romance' },
        ]}
      />

      <Select
        label="Tipo"
        name="tipo"
        value={filtroTipo}
        onChange={(e) => setFiltroTipo(e.target.value)}
        options={[
          { value: '', label: 'Todos los tipos' },
          { value: 'Película', label: 'Película' },
          { value: 'Serie', label: 'Serie' },
        ]}
      />

      <Select
        label="Ordenar por"
        name="orden"
        value={orden}
        onChange={(e) => setOrden(e.target.value)}
        options={[
          { value: '', label: 'Sin orden' },
          { value: 'añoAsc', label: 'Año ascendente' },
          { value: 'añoDesc', label: 'Año descendente' },
          { value: 'ratingAsc', label: 'Rating ascendente' },
          { value: 'ratingDesc', label: 'Rating descendente' },
        ]}
      />
    </div>
  );
};

export default Filtros;

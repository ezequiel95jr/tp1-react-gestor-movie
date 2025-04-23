import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import Select from '../Select/Select';
import Busqueda from '../Busqueda/Busqueda';
import styles from './Filtro.module.css';

const Filtros = ({ peliculas, peliculasVistas, setPeliculasFiltradas, setPeliculasVistasFiltradas }) => {

  const [filtroGenero, setFiltroGenero] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [orden, setOrden] = useState('');

  const aplicarFiltros = () => {
    let filtradasPeliculas = [...peliculas];
    let filtradasPeliculasVistas = [...peliculasVistas];

    if (filtroGenero) {
      filtradasPeliculas = filtradasPeliculas.filter((p) => p.genero === filtroGenero);
      filtradasPeliculasVistas = filtradasPeliculasVistas.filter((p) => p.genero === filtroGenero);
    }

    if (filtroTipo) {
      filtradasPeliculas = filtradasPeliculas.filter((p) => p.tipo === filtroTipo);
      filtradasPeliculasVistas = filtradasPeliculasVistas.filter((p) => p.tipo === filtroTipo);
    }

    switch (orden) {
      case 'añoAsc':
        filtradasPeliculas.sort((a, b) => a.año - b.año);
        filtradasPeliculasVistas.sort((a, b) => a.año - b.año);
        break;
      case 'añoDesc':
        filtradasPeliculas.sort((a, b) => b.año - a.año);
        filtradasPeliculasVistas.sort((a, b) => b.año - a.año);
        break;
      case 'ratingAsc':
        filtradasPeliculas.sort((a, b) => a.rating - b.rating);
        filtradasPeliculasVistas.sort((a, b) => a.rating - b.rating);
        break;
      case 'ratingDesc':
        filtradasPeliculas.sort((a, b) => b.rating - a.rating);
        filtradasPeliculasVistas.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setPeliculasFiltradas(filtradasPeliculas);
    setPeliculasVistasFiltradas(filtradasPeliculasVistas);
  };

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

      <Button onClick={aplicarFiltros}>Aplicar Filtros</Button>
    </div>
  );
};

export default Filtros
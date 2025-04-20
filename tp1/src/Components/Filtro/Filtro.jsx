import React, { useState } from 'react';
import Button from '../Button/Button'; 
import Select from '../Select/Select';
import styles from './Filtro.module.css'; 

const Filtros = ({ peliculas, peliculasVistas, setPeliculasFiltradas, setPeliculasVistasFiltradas }) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroGenero, setFiltroGenero] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [orden, setOrden] = useState('');

  const aplicarFiltros = () => {
    let filtradasPeliculas = [...peliculas];
    let filtradasPeliculasVistas = [...peliculasVistas];

    if (busqueda) {
      filtradasPeliculas = filtradasPeliculas.filter(
        (p) =>
          p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.director.toLowerCase().includes(busqueda.toLowerCase())
      );
      filtradasPeliculasVistas = filtradasPeliculasVistas.filter(
        (p) =>
          p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.director.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (filtroGenero) {
      filtradasPeliculas = filtradasPeliculas.filter((p) => p.genero === filtroGenero);
      filtradasPeliculasVistas = filtradasPeliculasVistas.filter((p) => p.genero === filtroGenero);
    }

    if (filtroTipo) {
      filtradasPeliculas = filtradasPeliculas.filter((p) => p.tipo === filtroTipo);
      filtradasPeliculasVistas = filtradasPeliculasVistas.filter((p) => p.tipo === filtroTipo);
    }

    if (orden === 'añoAsc') {
      filtradasPeliculas.sort((a, b) => a.año - b.año);
      filtradasPeliculasVistas.sort((a, b) => a.año - b.año);
    } else if (orden === 'añoDesc') {
      filtradasPeliculas.sort((a, b) => b.año - a.año);
      filtradasPeliculasVistas.sort((a, b) => b.año - a.año);
    } else if (orden === 'ratingAsc') {
      filtradasPeliculas.sort((a, b) => a.rating - b.rating);
      filtradasPeliculasVistas.sort((a, b) => a.rating - b.rating);
    } else if (orden === 'ratingDesc') {
      filtradasPeliculas.sort((a, b) => b.rating - a.rating);
      filtradasPeliculasVistas.sort((a, b) => b.rating - a.rating);
    }

    setPeliculasFiltradas(filtradasPeliculas);
    setPeliculasVistasFiltradas(filtradasPeliculasVistas);
  };

  return (
    <div className={styles.filtros}>
      <input
        type="text"
        placeholder="Buscar por título o director"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

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

export default Filtros;

import React, { useState } from 'react';
import Button from '../Button/Button'; 
import Select from '../Select/Select';  


const Filtros = ({ peliculas, setPeliculasFiltradas }) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroGenero, setFiltroGenero] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [orden, setOrden] = useState('');

  const aplicarFiltros = () => {
    let filtradas = [...peliculas];

    if (busqueda) {
      filtradas = filtradas.filter(
        (p) =>
          p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.director.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (filtroGenero) {
      filtradas = filtradas.filter((p) => p.genero === filtroGenero);
    }

    if (filtroTipo) {
      filtradas = filtradas.filter((p) => p.tipo === filtroTipo);
    }

    if (orden === 'añoAsc') {
      filtradas.sort((a, b) => a.año - b.año);
    } else if (orden === 'añoDesc') {
      filtradas.sort((a, b) => b.año - a.año);
    } else if (orden === 'ratingAsc') {
      filtradas.sort((a, b) => a.rating - b.rating);
    } else if (orden === 'ratingDesc') {
      filtradas.sort((a, b) => b.rating - a.rating);
    }

    setPeliculasFiltradas(filtradas);
  };

  return (
    <div className="filtros">
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

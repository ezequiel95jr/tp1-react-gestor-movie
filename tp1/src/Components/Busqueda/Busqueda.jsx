import React, { useState } from 'react';
import Button from '../Button/Button';
import styles from './Busqueda.module.css';

const Busqueda = ({ peliculas, peliculasVistas, setPeliculasFiltradas, setPeliculasVistasFiltradas }) => {
  const [busqueda, setBusqueda] = useState('');

  const onBusqueda = () => {
    let filtradasPeliculas = [...peliculas];
    let filtradasPeliculasVistas = [...peliculasVistas];

    const texto = busqueda.toLowerCase();

    if (texto) {
      filtradasPeliculas = filtradasPeliculas.filter(
        (p) =>
          p.titulo.toLowerCase().includes(texto) || p.director.toLowerCase().includes(texto)
      );
      filtradasPeliculasVistas = filtradasPeliculasVistas.filter(
        (p) =>
          p.titulo.toLowerCase().includes(texto) || p.director.toLowerCase().includes(texto)
      );
    }

    setPeliculasFiltradas(filtradasPeliculas);
    setPeliculasVistasFiltradas(filtradasPeliculasVistas);
  };

  return (
    <div className={styles.busqueda}>
      <input
        type="text"
        placeholder="Buscar por título o director"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <Button onClick={onBusqueda}>Buscar</Button>
    </div>
  );
};

export default Busqueda;
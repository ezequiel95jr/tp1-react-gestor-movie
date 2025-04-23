import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Header from "../../Components/Header/Header";
import Filtro from "../../Components/Filtro/Filtro";
import Card from "../../Components/Card/Card";
import { peliculasPorDefecto } from "../../assets/peliculas/Peliculas";


function Home() {
  const [peliculas, setPeliculas] = useState([]);
  const [peliculasPorVerFiltradas, setPeliculasPorVerFiltradas] = useState([]);
  const [peliculasVistasFiltradas, setPeliculasVistasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const guardadas = JSON.parse(localStorage.getItem("peliculas"));
    if (guardadas && guardadas.length > 0) {
      setPeliculas(guardadas);
    } else {
      setPeliculas(peliculasPorDefecto);
      localStorage.setItem("peliculas", JSON.stringify(peliculasPorDefecto));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("peliculas", JSON.stringify(peliculas));
  }, [peliculas]);

  const peliculasPorVer = peliculas.filter((p) => !p.vista);
  const peliculasYaVistas = peliculas.filter((p) => p.vista);

  const manejarBusqueda = (texto) => {
    setBusqueda(texto);

    if (texto.trim() === "") {
      setPeliculasPorVerFiltradas([]);
      setPeliculasVistasFiltradas([]);
      return;
    }

    const textoLower = texto.toLowerCase();

    const filtradasPorVer = peliculasPorVer.filter(
      (p) =>
        p.titulo.toLowerCase().includes(textoLower) ||
        p.director.toLowerCase().includes(textoLower)
    );
    const filtradasVistas = peliculasYaVistas.filter(
      (p) =>
        p.titulo.toLowerCase().includes(textoLower) ||
        p.director.toLowerCase().includes(textoLower)
    );

    setPeliculasPorVerFiltradas(filtradasPorVer);
    setPeliculasVistasFiltradas(filtradasVistas);
  };

  const agregarPelicula = (nuevaPelicula) => {
    const nueva = {
      ...nuevaPelicula,
      id: crypto.randomUUID(),
      vista: nuevaPelicula.vista || false,
    };
    const nuevasPeliculas = [...peliculas, nueva];
    setPeliculas(nuevasPeliculas);
    localStorage.setItem("peliculas", JSON.stringify(nuevasPeliculas));
  };

  const modificarPelicula = (editada) => {
    const actualizadas = peliculas.map((p) =>
      p.id === editada.id ? { ...editada } : p
    );
    setPeliculas(actualizadas);
  };

  const eliminarConConfirmacion = (id) => {
    if (window.confirm("¿Eliminar esta película/serie?")) {
      const actualizadas = peliculas.filter((p) => p.id !== id);
      setPeliculas(actualizadas);
    }
  };

  const MarcarVista = (id) => {
    const actualizadas = peliculas.map((p) =>
      p.id === id ? { ...p, vista: !p.vista } : p
    );
    setPeliculas(actualizadas);
  };

  const listaPorVer = busqueda ? peliculasPorVerFiltradas : peliculasPorVer;
  const listaVistas = busqueda ? peliculasVistasFiltradas : peliculasYaVistas;

  return (
    <div>
      <Header onAgregarPelicula={agregarPelicula} onBusqueda={manejarBusqueda} />
      <Filtro peliculas={peliculas} setPeliculas={setPeliculas} />

      <div className={styles.titulo}>
        <h3>Películas por ver | [CONTADOR: {listaPorVer.length}]</h3>
      </div>
      <div className={styles.box}>
        {listaPorVer.length > 0 ? (
          listaPorVer.map((pelicula) => (
            <Card
              key={pelicula.id}
              pelicula={pelicula}
              onEliminar={eliminarConConfirmacion}
              onModificar={modificarPelicula}
              onMarcarVista={() => MarcarVista(pelicula.id)}
              vista={pelicula.vista}
            />
          ))
        ) : (
          <p>{busqueda ? "No existen resultados." : "No hay películas pendientes."}</p>
        )}
      </div>

      <div className={styles.titulo}>
        <h3>Películas vistas | [CONTADOR: {listaVistas.length}]</h3>
      </div>
      <div className={styles.box}>
        {listaVistas.length > 0 ? (
          listaVistas.map((pelicula) => (
            <Card
              key={pelicula.id}
              pelicula={pelicula}
              onEliminar={eliminarConConfirmacion}
              onModificar={modificarPelicula}
              onMarcarVista={() => MarcarVista(pelicula.id)}
              vista={pelicula.vista}
            />
          ))
        ) : (
          <p>{busqueda ? "No existen resultados." : "No hay películas vistas aún."}</p>
        )}
      </div>
    </div>
  );
}

export default Home;

import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Titulo from "../../Components/Titulo/Titulo";
import Button from "../../Components/Button/Button";
import Form from "../../Components/Form/Form";
import Card from "../../Components/Card/Card";
import Modal from "../../Components/Modal/Modal";
import Header from "../../Components/Header/Header";
import Filtro from "../../Components/Filtro/Filtro";

function Home() {
  const [peliculas, setPeliculas] = useState([]);
  const [peliculasVistas, setPeliculasVistas] = useState([]);
  const [peliculasFiltradas, setPeliculasFiltradas] = useState([]);
  const [peliculasVistasFiltradas, setPeliculasVistasFiltradas] = useState([]);

  useEffect(() => {
    const peliculasGuardadas = JSON.parse(localStorage.getItem("peliculas")) || [];
    setPeliculas(peliculasGuardadas);
    setPeliculasFiltradas(peliculasGuardadas);
  }, []);

  useEffect(() => {
    const vistasGuardadas = JSON.parse(localStorage.getItem("vistas")) || [];
    setPeliculasVistas(vistasGuardadas);
    setPeliculasVistasFiltradas(vistasGuardadas);
  }, []);

  const agregarPelicula = (nuevaPelicula) => {
    const idUnico = peliculas.length ? peliculas[peliculas.length - 1].id + 1 : 1;
    const nuevaConId = { ...nuevaPelicula, id: idUnico };
    const nuevasPeliculas = [...peliculas, nuevaConId];
    setPeliculas(nuevasPeliculas);
    setPeliculasFiltradas(nuevasPeliculas);
    localStorage.setItem("peliculas", JSON.stringify(nuevasPeliculas));
  };

  const eliminarPelicula = (pelicula) => {
    const filtradas = peliculas.filter((peli) => peli.id !== pelicula.id);
    setPeliculas(filtradas);
    setPeliculasFiltradas(filtradas);
    localStorage.setItem("peliculas", JSON.stringify(filtradas));
  };

  const modificarPelicula = (peliculaEditada) => {
    const actualizadas = peliculas.map((p) => p.id === peliculaEditada.id ? { ...peliculaEditada } : p);
    setPeliculas(actualizadas);
    setPeliculasFiltradas(actualizadas);
    localStorage.setItem("peliculas", JSON.stringify(actualizadas));
  };

  const marcarComoVista = (pelicula) => {
    if (!peliculasVistas.some((p) => p.id === pelicula.id)) {
      const nuevasVistas = [...peliculasVistas, pelicula];
      setPeliculasVistas(nuevasVistas);
      localStorage.setItem("vistas", JSON.stringify(nuevasVistas));

      const peliculasActualizadas = peliculas.filter((p) => p.id !== pelicula.id);
      setPeliculas(peliculasActualizadas);
      setPeliculasFiltradas(peliculasActualizadas);
      localStorage.setItem("peliculas", JSON.stringify(peliculasActualizadas));
    }
  };

  const eliminarConConfirmacion = (pelicula, esVista = false) => {
    const confirmacion = window.confirm("¿Confirmar eliminación?");
    if (confirmacion) {
      if (esVista) {
        const nuevasVistas = peliculasVistas.filter((p) => p.id !== pelicula.id);
        setPeliculasVistas(nuevasVistas);
        setPeliculasVistasFiltradas(nuevasVistas);
        localStorage.setItem("vistas", JSON.stringify(nuevasVistas));
      } else {
        const filtradas = peliculas.filter((peli) => peli.id !== pelicula.id);
        setPeliculas(filtradas);
        setPeliculasFiltradas(filtradas);
        localStorage.setItem("peliculas", JSON.stringify(filtradas));
      }
    }
  };

  const desmarcarComoVista = (pelicula) => {
    const nuevasVistas = peliculasVistas.filter((p) => p.id !== pelicula.id);
    setPeliculasVistas(nuevasVistas);
    setPeliculasVistasFiltradas(nuevasVistas);
    localStorage.setItem("vistas", JSON.stringify(nuevasVistas));

    const nuevasPeliculas = [...peliculas, pelicula];
    setPeliculas(nuevasPeliculas);
    setPeliculasFiltradas(nuevasPeliculas);
    localStorage.setItem("peliculas", JSON.stringify(nuevasPeliculas));
  };

  return (
    <div>
      <Header onAgregarPelicula={agregarPelicula} />
      <Filtro 
        peliculas={peliculas} 
        peliculasVistas={peliculasVistas}
        setPeliculasFiltradas={setPeliculasFiltradas}
        setPeliculasVistasFiltradas={setPeliculasVistasFiltradas} 
      />
      <div className={styles.home}>
      <h2>Películas por ver</h2>
        <div className={styles.box}>
          {peliculasFiltradas.length > 0 ? (
            peliculasFiltradas.map((pelicula) => (
              <Card
                key={pelicula.id}
                pelicula={pelicula}
                onEliminar={eliminarConConfirmacion}
                onModificar={modificarPelicula}
                onMarcarVista={() => marcarComoVista(pelicula)}
              />
            ))
          ) : (
            <p>No hay películas agregadas aún.</p>
          )}
        </div>

        {peliculasVistasFiltradas.length > 0 && (
          <div className={styles.vistas}>
            <h2>Películas Vistas</h2>
            <div className={styles.box}>
              {peliculasVistasFiltradas.map((pelicula) => (
                <Card
                  key={pelicula.id}
                  pelicula={pelicula}
                  onEliminar={() => eliminarConConfirmacion(pelicula, true)}
                  onModificar={modificarPelicula}
                  onMarcarVista={() => desmarcarComoVista(pelicula)}
                  vista={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

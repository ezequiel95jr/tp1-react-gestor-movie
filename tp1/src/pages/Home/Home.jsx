import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Titulo from "../../Components/Titulo/Titulo";
import Button from "../../Components/Button/Button";
import Form from "../../Components/Form/Form";
import Card from "../../Components/Card/Card";
import Modal from "../../Components/Modal/Modal";
import Header from "../../Components/Header/Header";

function Home() {
  const [peliculas, setPeliculas] = useState([]);
  const [peliculasVistas, setPeliculasVistas] = useState([]);


  useEffect(() => {
    const peliculasGuardadas = JSON.parse(localStorage.getItem("peliculas")) || [];
    if (peliculasGuardadas.length > 0) {
      setPeliculas(peliculasGuardadas);
    }
  }, []);


  useEffect(() => {
    const vistasGuardadas = JSON.parse(localStorage.getItem("vistas")) || [];
    if (vistasGuardadas.length > 0) {
      setPeliculasVistas(vistasGuardadas);
    }
  }, []);


  const agregarPelicula = () => {
    const idUnico = peliculas.length ? peliculas[peliculas.length - 1].id + 1 : 1;
    const nuevaConId = { ...nuevaPelicula, id: idUnico };
    const nuevasPeliculas = [...peliculas, nuevaConId];
    setPeliculas(nuevasPeliculas);
    setNuevaPelicula({
      titulo: "",
      genero: "",
      tipo: "",
      año: "",
      director: "",
      rating: 0,
    });


    localStorage.setItem("peliculas", JSON.stringify(nuevasPeliculas));
  };


  const eliminarPelicula = (pelicula) => {
    const filtradas = peliculas.filter((peli) => peli.id !== pelicula.id);
    setPeliculas(filtradas);

    localStorage.setItem("peliculas", JSON.stringify(filtradas));
  };


  



  const modificarPelicula = (peliculaEditada) => {
    const actualizadas = peliculas.map((p) => p.id === peliculaEditada.id ? { ...peliculaEditada } : p
    );
    setPeliculas(actualizadas);

    localStorage.setItem("peliculas", JSON.stringify(actualizadas));
  };


  const marcarComoVista = (pelicula) => {
    if (!peliculasVistas.some((p) => p.id === pelicula.id)) {
      const nuevasVistas = [...peliculasVistas, pelicula];
      setPeliculasVistas(nuevasVistas);
      localStorage.setItem("vistas", JSON.stringify(nuevasVistas));
  
      const peliculasActualizadas = peliculas.filter((p) => p.id !== pelicula.id);
      setPeliculas(peliculasActualizadas);
      localStorage.setItem("peliculas", JSON.stringify(peliculasActualizadas));
    }
  };
  


  useEffect(() => {
    if (peliculas.length > 0) {
      localStorage.setItem("peliculas", JSON.stringify(peliculas));
    }
  }, [peliculas]);


  useEffect(() => {
    if (peliculasVistas.length > 0) {
      localStorage.setItem("vistas", JSON.stringify(peliculasVistas));
    }
  }, [peliculasVistas]);

  const eliminarConConfirmacion = (pelicula, esVista = false) => {
    const confirmacion = window.confirm("¿Confirmar eliminación?");
    if (confirmacion) {
      if (esVista) {
        const nuevasVistas = peliculasVistas.filter((p) => p.id !== pelicula.id);
        setPeliculasVistas(nuevasVistas);
        localStorage.setItem("vistas", JSON.stringify(nuevasVistas));
      } else {
        const filtradas = peliculas.filter((peli) => peli.id !== pelicula.id);
        setPeliculas(filtradas);
        localStorage.setItem("peliculas", JSON.stringify(filtradas));
      }
    }
  };
  const desmarcarComoVista = (pelicula) => {
   
    const nuevasVistas = peliculasVistas.filter((p) => p.id !== pelicula.id);
    setPeliculasVistas(nuevasVistas);
    localStorage.setItem("vistas", JSON.stringify(nuevasVistas));
  
    const nuevasPeliculas = [...peliculas, pelicula];
    setPeliculas(nuevasPeliculas);
    localStorage.setItem("peliculas", JSON.stringify(nuevasPeliculas));
  }; 

  return (
  <div>
    <Header
      onAgregarPelicula={(peliculaNueva) => {
        const idUnico = peliculas.length ? peliculas[peliculas.length - 1].id + 1 : 1;
        const nuevaConId = { ...peliculaNueva, id: idUnico };
        const nuevasPeliculas = [...peliculas, nuevaConId];
        setPeliculas(nuevasPeliculas);
        localStorage.setItem("peliculas", JSON.stringify(nuevasPeliculas));
      }}
    />

    <div className={styles.home}>
      <div className={styles.box}>
        {peliculas.length > 0 ? (
          peliculas.map((pelicula) => (
            <Card
              key={pelicula.id}
              pelicula={pelicula}
              onEliminar={() => eliminarConConfirmacion(pelicula, false)}
              onModificar={modificarPelicula}
              onMarcarVista={() => marcarComoVista(pelicula)} 
            />
          ))
        ) : (
          <p>No hay películas agregadas aún.</p>
        )}
      </div>

      {peliculasVistas.length > 0 && (
        <div className={styles.vistas}>
          <h2>Películas Vistas</h2>
          <div className={styles.box}>
            {peliculasVistas.map((pelicula) => (
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

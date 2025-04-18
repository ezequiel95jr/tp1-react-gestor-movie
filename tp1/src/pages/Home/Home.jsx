import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Titulo from "../../Components/Titulo/Titulo";
import Button from "../../Components/Button/Button";
import Form from "../../Components/Form/Form";
import Card from "../../Components/Card/Card";

const Home = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [peliculasVistas, setPeliculasVistas] = useState([]);
  const [nuevaPelicula, setNuevaPelicula] = useState({
    titulo: "",
    genero: "",
    tipo: "",
    año: "",
    director: "",
    rating: 0,
  });

  
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

  
  const cambiarCampos = (e) => {
    const { name, value } = e.target;
    setNuevaPelicula((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 
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


  const eliminarConConfirmacion = (id) => {
    const confirmacion = window.confirm("Confirmar eliminacion?");
    if (confirmacion) {
      eliminarPelicula(id); 
    }
  };
  

  
  const modificarPelicula = (peliculaEditada) => {
    const actualizadas = peliculas.map((p) =>
      p.id === peliculaEditada.id ? { ...peliculaEditada } : p
    );
    setPeliculas(actualizadas);
    
    localStorage.setItem("peliculas", JSON.stringify(actualizadas));
  };

  
  const marcarComoVista = (pelicula) => {
    if (!peliculasVistas.some((p) => p.id === pelicula.id)) {
      const nuevasVistas = [...peliculasVistas, pelicula];
      setPeliculasVistas(nuevasVistas);
      
      localStorage.setItem("vistas", JSON.stringify(nuevasVistas));
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

  return (
<<<<<<< HEAD
    <div>
=======
    <div className={styles.home}>
>>>>>>> c6a089356e88a923aa5d61e281f47fd42f7fdcba
      <Titulo titulo="Bienvenido al Gestor de Peliculas" />
      <Form
        onSubmit={agregarPelicula}
        onChange={cambiarCampos} 
        pelicula={nuevaPelicula}
      />

      {peliculas.length > 0 ? (
        peliculas.map((pelicula) => (
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
  );
};
<<<<<<< HEAD
=======

>>>>>>> c6a089356e88a923aa5d61e281f47fd42f7fdcba
export default Home;

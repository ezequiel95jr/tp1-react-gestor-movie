import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Titulo from "../../Components/Titulo/Titulo";
import Button from "../../Components/Button/Button";
import Form from "../../Components/Form/Form";
import Card from "../../Components/Card/Card";

const Home = () => {
  
//States

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

  // useEffect
  useEffect(() => {
    const peliculasGuardadas = JSON.parse(localStorage.getItem("peliculas")) || [];
    setPeliculas(peliculasGuardadas);
  }, []);
  
  useEffect(() => {
    const vistasGuardadas = JSON.parse(localStorage.getItem("vistas")) || [];
    setPeliculasVistas(vistasGuardadas);
  }, []);
  //Funciones
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
  
    setNuevaPelicula((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  const agregarPelicula = () => {
    const nuevasPeliculas = [...peliculas, nuevaPelicula];
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

const eliminarPelicula = (titulo) => {
  const filtradas = peliculas.filter((peli) => peli.titulo !== titulo);
  setPeliculas(filtradas);
  localStorage.setItem("peliculas", JSON.stringify(filtradas));
};

const modificarPelicula = (pelicula) => {
  setNuevaPelicula(pelicula);
};

const marcarComoVista = (pelicula) => {
  if (!peliculasVistas.some((p) => p.titulo === pelicula.titulo)) {
    const nuevasVistas = [...peliculasVistas, pelicula];
    setPeliculasVistas(nuevasVistas);
    localStorage.setItem("vistas", JSON.stringify(nuevasVistas));
  }
};
  return (
    <div className="home">
      <Titulo titulo="Bienvenido al Gestor de Peliculas" />

      <Form
        onSubmit={agregarPelicula}
        onChange={handleChange}
        pelicula={nuevaPelicula}/>

  {peliculas.length > 0 ? (
    peliculas.map((pelicula) => (
      <Card
      key={pelicula.titulo}
      pelicula={pelicula}
      onEliminar={() => eliminarPelicula(pelicula.titulo)}
      onModificar={() => modificarPelicula(pelicula.titulo)}
      onMarcarVistas={() => marcarComoVista(pelicula)}
    />
  ))
) : (
  <p>No hay películas agregadas aún.</p>
)}

    </div>
  );
}

export default Home;
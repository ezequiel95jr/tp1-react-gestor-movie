import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Titulo from "../../Components/Titulo/Titulo";
import Button from "../../Components/Button/Button";
import Form from "../../Components/Form/Form";
import Card from "../../Components/Card/Card";

const Home = () => {
  
//States

const [peliculas, setPeliculas] = useState([]);


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


  return (
    <div className="home">
      <Titulo titulo="Bienvenido al Gestor de Peliculas" />

      <Form
        onSubmit={agregarPelicula}
        onChange={handleChange}
        pelicula={nuevaPelicula}/>

  {peliculas.length > 0 ? (
    peliculas.map((pelicula) => (
    <Card key={pelicula.titulo} pelicula={pelicula} />
  ))
) : (
  <p>No hay películas agregadas aún.</p>
)}

    </div>
  );
}

export default Home;
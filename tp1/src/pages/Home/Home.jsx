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

  // Cargar del localStorage solo al inicio
  useEffect(() => {
    const peliculasGuardadas = JSON.parse(localStorage.getItem("peliculas")) || [];
    setPeliculas(peliculasGuardadas);

    const vistasGuardadas = JSON.parse(localStorage.getItem("vistas")) || [];
    setPeliculasVistas(vistasGuardadas);
  }, []);

  // Guardar automáticamente las películas cada vez que cambian
  useEffect(() => {
    localStorage.setItem("peliculas", JSON.stringify(peliculas));
  }, [peliculas]);

  // Guardar automáticamente las vistas cada vez que cambian
  useEffect(() => {
    localStorage.setItem("vistas", JSON.stringify(peliculasVistas));
  }, [peliculasVistas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevaPelicula((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarPelicula = () => {
    const idUnico = peliculas.length ? peliculas[peliculas.length - 1].id + 1 : 1;
    const nuevaConId = { ...nuevaPelicula, id: idUnico };
    setPeliculas([...peliculas, nuevaConId]);
    setNuevaPelicula({
      titulo: "",
      genero: "",
      tipo: "",
      año: "",
      director: "",
      rating: 0,
    });
  };

  const eliminarPelicula = (id) => {
    setPeliculas(peliculas.filter((peli) => peli.id !== id));
  };

  const modificarPelicula = (peliculaEditada) => {
    const actualizadas = peliculas.map((p) =>
      p.id === peliculaEditada.id ? { ...peliculaEditada } : p
    );
    setPeliculas(actualizadas);
  };

  const marcarComoVista = (pelicula) => {
    if (!peliculasVistas.some((p) => p.id === pelicula.id)) {
      setPeliculasVistas([...peliculasVistas, pelicula]);
    }
  };

  return (
    <div className="home">
      <Titulo titulo="Bienvenido al Gestor de Peliculas" />
      <Form onSubmit={agregarPelicula} onChange={handleChange} pelicula={nuevaPelicula} />

      {peliculas.length > 0 ? (
        peliculas.map((pelicula) => (
          <Card
            key={pelicula.id}
            pelicula={pelicula}
            onEliminar={() => eliminarPelicula(pelicula.id)}
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

export default Home;

import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Titulo from "../../Components/Titulo/Titulo";
import Button from "../../Components/Button/Button";
import Form from "../../Components/Form/Form"; 

const Home = () => {
  //useStates
  const [listaPorVer, setListaPorVer] = useState([]);
  const [listaVistas, setListaVistas] = useState([]);
  const [filtroGenero, setFiltroGenero] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [busqueda, setBusqueda ] = useState("");
  const [orden, setOrden] = useState({campo: "año", tipo: "ascendete"});
  const [peliculas, setPeliculas] = useState([]);
 

//useEffect 

  useEffect(() => {
    const data = localStorage.getItem("peliculas");
    if (data) {
    setPeliculas(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("peliculas", JSON.stringify(peliculas));
  }, [peliculas]);
  
  /**const agregarPelicula = (nuevaPelicula) => { 
    const nuevaPelicula =[... peliculas, nuevaPelicula];
    setPeliculas(nuevasPeliculas);
    localStorage.setItem("peliculas", JSON.stringify(nuevasPeliculas));
  }*/




  return (
    <div className="home">
      <Titulo titulo="Bienvenido al Gestor de Peliculas" />
    </div>
  );
}

export default Home;
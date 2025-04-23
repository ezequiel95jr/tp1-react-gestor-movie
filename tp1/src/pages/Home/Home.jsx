import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Header from "../../Components/Header/Header";
import Filtro from "../../Components/Filtro/Filtro";
import Card from "../../Components/Card/Card";

function Home() {
  const [peliculas, setPeliculas] = useState([]);  
  const [peliculasPorVerFiltradas, setPeliculasPorVerFiltradas] = useState([]);
  const [peliculasVistasFiltradas, setPeliculasVistasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  
  useEffect(() => {
    const guardadas = JSON.parse(localStorage.getItem("peliculas"));
    if (guardadas && guardadas.length > 0) {
      setPeliculas(guardadas);  
    }
  }, []);


  
  useEffect(() => {
    if (peliculas.length > 0) {
      localStorage.setItem("peliculas", JSON.stringify(peliculas));
    }
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
  };

  const modificarPelicula = (editada) => {
    const actualizadas = peliculas.map((p) =>
      p.id === editada.id ? { ...editada } : p
    );
    setPeliculas(actualizadas);
  };

  const eliminarConConfirmacion = (id) => {
    console.log("Intentando eliminar película con id:", id); 
    if (window.confirm("¿Eliminar esta película/serie?")) {
      
      peliculas.forEach((pelicula) => {
        console.log(`Película en el array: ${pelicula.titulo}, id: ${pelicula.id}`);
      });

      const actualizadas = peliculas.filter((p) => {
        console.log(`Comparando ${p.id} con ${id}`); 
        return p.id !== id; 
      });

      console.log("Películas después de la eliminación:", actualizadas); 
      setPeliculas(actualizadas);
      localStorage.setItem("peliculas", JSON.stringify(actualizadas));
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
      <Filtro
        peliculas={peliculas.filter((p) => !p.vista)}
        peliculasVistas={peliculas.filter((p) => p.vista)}
        setPeliculasFiltradas={setPeliculasPorVerFiltradas}
        setPeliculasVistasFiltradas={setPeliculasVistasFiltradas}
      />

      <div className={styles.titulo}>
        <h3>Películas por ver | [CONTADOR: {listaPorVer.length}]</h3>
      </div>
      <div className={styles.box}>
        {listaPorVer.length > 0 ? (
          listaPorVer.map((pelicula) => (
            <Card
              key={pelicula.id}
              pelicula={pelicula}
              onEliminar={() => eliminarConConfirmacion(pelicula.id)} 
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
              onEliminar={() => eliminarConConfirmacion(pelicula.id)}
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

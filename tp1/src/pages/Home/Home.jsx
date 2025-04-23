import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Header from "../../Components/Header/Header";
import Filtro from "../../Components/Filtro/Filtro";
import Card from "../../Components/Card/Card";

function Home() {
  const [peliculas, setPeliculas] = useState([]);  // Lista vacía inicialmente
  const [peliculasPorVerFiltradas, setPeliculasPorVerFiltradas] = useState([]);
  const [peliculasVistasFiltradas, setPeliculasVistasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtrosActivos, setFiltrosActivos] = useState(false);

  
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
  
    // Actualizar las listas filtradas de inmediato
    if (busqueda.trim() === "") {
      setPeliculasPorVerFiltradas(nuevasPeliculas.filter((p) => !p.vista));
      setPeliculasVistasFiltradas(nuevasPeliculas.filter((p) => p.vista));
    } else {
      manejarBusqueda(busqueda); // Ejecuta el filtro si hay búsqueda activa
    }
  };
  
  const modificarPelicula = (editada) => {
    const actualizadas = peliculas.map((p) =>
      p.id === editada.id ? { ...editada } : p
    );
    setPeliculas(actualizadas);
  
    // Actualizar las listas filtradas después de la modificación
    if (busqueda.trim() === "") {
      setPeliculasPorVerFiltradas(actualizadas.filter((p) => !p.vista));
      setPeliculasVistasFiltradas(actualizadas.filter((p) => p.vista));
    } else {
      manejarBusqueda(busqueda); // Vuelve a aplicar la búsqueda
    }
  };
  
  const eliminarConConfirmacion = (id) => {
    if (window.confirm("¿Eliminar esta película/serie?")) {
      const actualizadas = peliculas.filter((p) => p.id !== id);
      setPeliculas(actualizadas);
  
      // Actualizar las listas filtradas después de la eliminación
      if (busqueda.trim() === "") {
        setPeliculasPorVerFiltradas(actualizadas.filter((p) => !p.vista));
        setPeliculasVistasFiltradas(actualizadas.filter((p) => p.vista));
      } else {
        manejarBusqueda(busqueda); // Aplica el filtro si hay búsqueda activa
      }
    }
  };
  


  const MarcarVista = (id) => {
    // Actualiza el estado de vista de la película
    const actualizadas = peliculas.map((p) =>
      p.id === id ? { ...p, vista: !p.vista } : p
    );
    setPeliculas(actualizadas);
  
    // Actualiza las listas filtradas de inmediato para reflejar el cambio
    if (busqueda.trim() === "") {
      setPeliculasPorVerFiltradas(actualizadas.filter((p) => !p.vista)); // Películas por ver
      setPeliculasVistasFiltradas(actualizadas.filter((p) => p.vista));   // Películas vistas
    } else {
      manejarBusqueda(busqueda); // Vuelve a aplicar el filtro si hay búsqueda activa
    }
  };
  

  const listaPorVer = filtrosActivos || busqueda
    ? peliculasPorVerFiltradas
    : peliculasPorVer;

  const listaVistas = filtrosActivos || busqueda
    ? peliculasVistasFiltradas
    : peliculasYaVistas;

  return (
    <div>
      <Header onAgregarPelicula={agregarPelicula} onBusqueda={manejarBusqueda} />
      <Filtro
        peliculas={peliculas.filter((p) => !p.vista)}
        peliculasVistas={peliculas.filter((p) => p.vista)}
        setPeliculasFiltradas={setPeliculasPorVerFiltradas}
        setPeliculasVistasFiltradas={setPeliculasVistasFiltradas}
        setFiltrosActivos={setFiltrosActivos}
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
          <p>
  {(busqueda || filtrosActivos)
    ? "No existen resultados."
    : "No hay películas pendientes."}
</p>
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
          <p>
  {(busqueda || filtrosActivos)
    ? "No existen resultados."
    : "No hay películas pendientes."}
</p>
        )}
      </div>
    </div>
  );
}

export default Home;

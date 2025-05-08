import { useState } from "react";
import Button from "../Button/Button";
import Form from "../Form/Form";
import Modal from "../Modal/Modal";
import styles from "./Header.module.css";
import Busqueda from "../Busqueda/Busqueda";
//Nombre de archivo deberia estar con mayuscula
import logo from "../../assets/images/cinema-paradiso.png";

const Header = ({ onAgregarPelicula, onBusqueda}) => {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaPelicula, setNuevaPelicula] = useState({
    titulo: "",
    genero: "",
    tipo: "",
    año: "",
    director: "",
    rating: 0,
  });


  const cambiarCampos = (e) => {
    const { name, value } = e.target;
    setNuevaPelicula((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregar = () => {
    onAgregarPelicula(nuevaPelicula);
    setNuevaPelicula({
      titulo: "",
      genero: "",
      tipo: "",
      año: "",
      director: "",
      rating: 0,
    });
    setMostrarModal(false);
  };

    const manejarBusqueda = (e) => {
      setBusqueda(e.target.value);
      onBusqueda(e.target.value); 
  }
  return (
    <header className={styles.header}>
      <img src={logo} alt="Mi catálogo de películas" className={styles.logo} />
      <input 
      type="text"
      placeholder="Título/Director" 
      value={busqueda}
      onChange={manejarBusqueda}
      />
      <Button onClick={() => setMostrarModal(true)}>Agregar</Button>

      {mostrarModal && (
        <Modal onClose={() => setMostrarModal(false)}>
          <Form
            pelicula={nuevaPelicula}
            onChange={cambiarCampos}
            onSubmit={agregar}
          />
        </Modal>
      )}
    </header>
  );
};

export default Header;


import { useState } from "react";
import Button from "../Button/Button";
import Form from "../Form/Form";
import Modal from "../Modal/Modal";
import styles from "./Header.module.css";
import logo from "../../assets/images/cinema-logo.png";

const Header = ({ onAgregarPelicula }) => {
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

  return (
    <header className={styles.header}>
      <h1>Mi gestor</h1>
    <img src={logo} alt="Mi catálogo de películas" className={styles.logo} />
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


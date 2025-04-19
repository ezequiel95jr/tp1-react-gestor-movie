import React from "react";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <h1>🎬 Mi Gestor de Películas</h1>
      <nav>
        <ul>
          <li><a href="/">Inicio</a></li>
          <li><a href="#form">Agregar</a></li>
          <li><a href="#vistas">Vistas</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

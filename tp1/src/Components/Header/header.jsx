import React from "react";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <h1>🎬 Mi Gestor de Películas</h1>
      <nav>
        <ul>
          <li><a href="/">Buscar</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

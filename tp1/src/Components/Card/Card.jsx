import "./Card.css";
import Button from "../Button/Button";


const Card = ({ pelicula,onEliminar, onModificar, onMarcarVista}) => {
    return ( 
        <div className="card">
            <h3>{pelicula.titulo}</h3>
            <p>Genero: {pelicula.genero}</p>
            <p>Año: {pelicula.año}</p>
            <p>Director: {pelicula.director}</p>
            <p>Rating: {pelicula.rating}</p>
            <div className="card-buttons">
                <Button texto="Eliminar" onClick={() => onEliminar(pelicula.titulo)} />
                <Button texto="Modificar" onClick={() => onModificar(pelicula)} />
                <Button texto="Vista" onClick={() => onMarcarVista(pelicula)} />
            </div>
        </div>
    );
};


export default Card;
import "./Card.css";


const Card = ({ pelicula}) => {
    return ( 
        <div className="card">
            <h3>{pelicula.titulo}</h3>
            <p>Genero: {pelicula.genero}</p>
            <p>Año: {pelicula.año}</p>
            <p>Director: {pelicula.director}</p>
            <p>Rating: {pelicula.rating}</p>
        </div>
    );
};


export default Card;
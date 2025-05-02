import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './Card.css';

export const Card = (props)=>{
    const {movie,handleMovieClick=Function.prototype}=props;
    const { theme } = useContext(ThemeContext);   
       
    return(
        <div           
            className={`movie-card ${theme}`}
            onClick={() => handleMovieClick(movie.id)}
            >
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
            />
            <h3>{movie.title}</h3>
            <p>
                {new Date(movie.release_date).getFullYear()} |{" "}
                {movie.vote_average.toFixed(1)} ⭐
            </p>
        </div> 
    )
}


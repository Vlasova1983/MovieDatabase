import React, { useEffect, useState} from "react";
import { CardHome } from "../components/CardHome";
import {CardContent} from "../components/CardContent";
import { API_KEY } from '../config';


const API_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;

export const HomePage=()=> {
    const [movies, setMovies] = useState([]);   
  
    useEffect(() => {
        fetch(API_URL)
        .then((res) => res.json())
        .then((data) => setMovies(data.results))
        .catch((err) => console.error("Failed to fetch movies", err));
    }, []);


  return (
    <div className="container">
      <h1>Трендові фільми цього тижня</h1>      
      <div className="movies-grid">
        {movies.map((movie,index) => (        
            <CardHome key={index}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}                
              />
              <CardContent>
                <h3 >{movie.title}</h3>
                <p>
                  Рейтинг: {movie.vote_average} / 10
                </p>
              </CardContent>
            </CardHome>        
        ))}
      </div>
    </div>
  );
}

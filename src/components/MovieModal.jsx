import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { API_KEY } from '../config';
import './MovieModal.css';

const MovieModal = ({ movieId, onClose, onSimilarMovieClick }) => {
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [videos, setVideos] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const [cast, setCast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        const [movieResponse, similarResponse, videosResponse, creditsResponse] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=uk-UA`),
          fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}&language=uk-UA&page=1`),
          fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=uk-UA`),
          fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=uk-UA`)
        ]);

        const [movieData, similarData, videosData, creditsData] = await Promise.all([
          movieResponse.json(),
          similarResponse.json(),
          videosResponse.json(),
          creditsResponse.json()
        ]);

        setMovie(movieData);
        setSimilarMovies(similarData.results.slice(0, 6));
        setVideos(videosData.results);
        setCast(creditsData.cast.slice(0, 6)); // Беремо перших 6 акторів
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const handleWatchClick = () => {
    setShowVideo(!showVideo);
  };

  const handleSimilarMovieClick = (movieId) => {
    onSimilarMovieClick(movieId);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (isLoading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="loading">Завантаження...</div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-content ${theme}`} onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>        
        {showVideo && videos.length > 0 ? (
          <div className="video-container">
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${videos[0].key}`}
              title={movie.title}
              // frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button className="back-button" onClick={handleWatchClick}>
              Назад до інформації
            </button>
          </div>
        ) : (
          <>
            <div className="movie-details">
              <div className="movie-poster">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
              </div>
              <div className="movie-info">
                <h2>{movie.title}</h2>
                <p className="release-date">
                  {new Date(movie.release_date).toLocaleDateString('uk-UA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="rating">⭐ {movie.vote_average.toFixed(1)}</p>
                <p className="overview">{movie.overview}</p>
                <div className="genres">
                  {movie.genres.map(genre => (
                    <span key={genre.id} className="genre-tag">
                      {genre.name}
                    </span>
                  ))}
                </div>
                {videos.length > 0 && (
                  <button className="watch-button" onClick={handleWatchClick}>
                    Дивитися трейлер
                  </button>
                )}
              </div>
            </div>

            <div className="cast-section">
              <h3>У головних ролях:</h3>
              <div className="cast-grid">
                {cast.map(actor => (
                  <div key={actor.id} className="actor-card">
                    <img
                      src={actor.profile_path 
                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                        : 'https://via.placeholder.com/200x300?text=No+Image'}
                      alt={actor.name}
                    />
                    <div className="actor-info">
                      <h4>{actor.name}</h4>
                      <p>{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="similar-movies">
              <h3>Схожі фільми:</h3>
              <div className="similar-movies-grid">
                {similarMovies.map(similarMovie => (
                  <div
                    key={similarMovie.id}
                    className="similar-movie-card"
                    onClick={() => handleSimilarMovieClick(similarMovie.id)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w200${similarMovie.poster_path}`}
                      alt={similarMovie.title}
                    />
                    <h4>{similarMovie.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieModal; 
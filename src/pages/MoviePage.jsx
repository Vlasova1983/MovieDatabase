import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import MovieModal from '../components/MovieModal';
import { API_KEY } from '../config';
import { Filters } from '../components/Filters';
import { Card } from '../components/Card';
import './MoviePage.css';

export const MoviePage=()=> {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [genres, setGenres] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [displayMode, setDisplayMode] = useState('popular');
  const [error, setError] = useState(null);
  const { theme } = useContext(ThemeContext);

  const fetchMoviesWithFilters = useCallback(() => {   
    if (!searchQuery && !yearFilter && !genreFilter && !ratingFilter) {
      setIsSearching(true);
      setError(null);
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=uk-UA&page=1`)    
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setMovies(data.results || []);
          setDisplayMode('popular');
          setIsSearching(false);
        })
        .catch(error => {
          console.error('Error fetching popular movies:', error);
          setError('Помилка при завантаженні популярних фільмів. Спробуйте пізніше.');
          setIsSearching(false);
        });
      return;
    }

    setIsSearching(true);
    setError(null);

    // Базовий URL для пошуку
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=uk-UA&sort_by=popularity.desc`;

    // Додаємо фільтри до URL
    if (yearFilter) {
      url += `&primary_release_year=${yearFilter}`;
    }

    if (genreFilter) {
      url += `&with_genres=${genreFilter}`;
    }

    if (ratingFilter) {
      url += `&vote_average.gte=${ratingFilter}`;
    }

    // Якщо є пошуковий запит, використовуємо search endpoint
    if (searchQuery.trim()) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=uk-UA&query=${encodeURIComponent(searchQuery)}`;
      if (yearFilter) {
        url += `&year=${yearFilter}`;
      }
    }

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        let filteredMovies = data.results || [];

        // Додаткова фільтрація для пошуку
        if (searchQuery.trim()) {
          if (genreFilter) {
            filteredMovies = filteredMovies.filter(movie => 
              movie.genre_ids && movie.genre_ids.includes(parseInt(genreFilter))
            );
          }

          if (ratingFilter) {
            filteredMovies = filteredMovies.filter(movie => 
              movie.vote_average && movie.vote_average >= parseFloat(ratingFilter)
            );
          }
        }

        if (filteredMovies.length > 0) {
          setMovies(filteredMovies);
          setDisplayMode('search');
        } else {
          setMovies([]);
          let errorMessage = 'Фільми не знайдено.';
          if (yearFilter && genreFilter && ratingFilter) {
            const genreName = genres.find(g => g.id === parseInt(genreFilter))?.name || 'обраного жанру';
            errorMessage = `Фільми жанру "${genreName}" за ${yearFilter} рік з рейтингом ${ratingFilter}+ не знайдено.`;
          } else if (yearFilter && genreFilter) {
            const genreName = genres.find(g => g.id === parseInt(genreFilter))?.name || 'обраного жанру';
            errorMessage = `Фільми жанру "${genreName}" за ${yearFilter} рік не знайдено.`;
          } else if (yearFilter && ratingFilter) {
            errorMessage = `Фільми за ${yearFilter} рік з рейтингом ${ratingFilter}+ не знайдено.`;
          } else if (genreFilter && ratingFilter) {
            const genreName = genres.find(g => g.id === parseInt(genreFilter))?.name || 'обраного жанру';
            errorMessage = `Фільми жанру "${genreName}" з рейтингом ${ratingFilter}+ не знайдено.`;
          } else if (yearFilter) {
            errorMessage = `Фільми за ${yearFilter} рік не знайдено.`;
          } else if (genreFilter) {
            const genreName = genres.find(g => g.id === parseInt(genreFilter))?.name || 'обраного жанру';
            errorMessage = `Фільми жанру "${genreName}" не знайдено.`;
          } else if (ratingFilter) {
            errorMessage = `Фільми з рейтингом ${ratingFilter}+ не знайдено.`;
          }
          setError(errorMessage);
        }
        setIsSearching(false);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        setError('Помилка при завантаженні фільмів. Спробуйте пізніше.');
        setIsSearching(false);
      });
  }, [searchQuery, yearFilter, genreFilter, ratingFilter, genres]);

  // Перший useEffect для завантаження жанрів та початкових даних
  useEffect(() => {
    setError(null);
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=uk-UA`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setGenres(data.genres || []))
      .catch(error => {
        console.error('Error fetching genres:', error);
        setError('Помилка при завантаженні жанрів. Спробуйте пізніше.');
      });

    // Завантаження початкових даних
    setIsSearching(true);
    setError(null);
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=uk-UA&page=1`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setMovies(data.results || []);
        setDisplayMode('popular');
        setIsSearching(false);
      })
      .catch(error => {
        console.error('Error fetching popular movies:', error);
        setError('Помилка при завантаженні популярних фільмів. Спробуйте пізніше.');
        setIsSearching(false);
      });
    //   console.log(movies);
  }, []); // Пустий масив залежностей - виконується тільки при монтажі

  // Другий useEffect для обробки змін фільтрів
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() || yearFilter || genreFilter || ratingFilter) {
        fetchMoviesWithFilters();
      }
    }, 500);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, yearFilter, genreFilter, ratingFilter, fetchMoviesWithFilters]);

  const handleMovieClick = (movieId) => {
    setSelectedMovieId(movieId);
  };

  const handleSimilarMovieClick = (movieId) => {
    setSelectedMovieId(movieId);
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
  };

  return (    
        <div className="container">          
            <Filters searchQuery={searchQuery}
            yearFilter={yearFilter}
            genreFilter={genreFilter}
            ratingFilter={ratingFilter}
            setSearchQuery={setSearchQuery}
            setYearFilter={setYearFilter}
            setGenreFilter={setGenreFilter}
            setRatingFilter={setRatingFilter}
            genres={genres}/>           
            <h2 className={`section-title ${theme}`}>
            {displayMode === 'search' ? (
              yearFilter && genreFilter ? 
                `Фільми жанру "${genres.find(g => g.id === parseInt(genreFilter))?.name || 'обраного жанру'}" за ${yearFilter} рік` :
                yearFilter ? 
                  `Фільми за ${yearFilter} рік` :
                  genreFilter ? 
                    `Фільми жанру "${genres.find(g => g.id === parseInt(genreFilter))?.name || 'обраного жанру'}"` :
                    'За вашим запитом'
            ) : 'Популярні фільми'}
          </h2>
          {error ? (
            <div className={`error-message ${theme}`}>{error}</div>
          ) : isSearching ? (
            <div className="loading">Завантаження...</div>
          ) : (
            <div className="movies-grid">
              {movies.length > 0 ? (
                movies.map((movie) => 
                  <Card key={movie.id} movie={movie} handleMovieClick={handleMovieClick}/>
                )) 
                : (
                <div className="no-results">
                  <p>Фільми не знайдено. Спробуйте інший запит.</p>
                </div>
              )}
            </div>
          )}
          {selectedMovieId && (
            <MovieModal
              movieId={selectedMovieId}
              onClose={handleCloseModal}
              onSimilarMovieClick={handleSimilarMovieClick}
            />
          )}
        </div>       
  );
}


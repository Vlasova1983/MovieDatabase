import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './Filters.css';

export const Filters = (props) => { 
    const { theme } = useContext(ThemeContext);
    const {searchQuery,
        setSearchQuery,
        yearFilter,
        setYearFilter,
        genreFilter,
        setGenreFilter,
        ratingFilter,
        setRatingFilter,
        genres}  =props; 
    return ( 
        <div className="search-container">
          <input
            type="text"
            className={theme}
            placeholder="Пошук фільмів (укр. або англ.)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className={theme}
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">Рік</option>
            {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(
              (year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              )
            )}
          </select>
          <select
            className={theme}
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <option value="">Жанр</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          <select
            className={theme}
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="">Рейтинг</option>
            <option value="7">7+ ⭐</option>
            <option value="8">8+ ⭐</option>
            <option value="9">9+ ⭐</option>
          </select>
        </div>
    )
}
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const CardHome=({ children })=> {
  const { theme } = useContext(ThemeContext);  
  return (
    <div className={`movie-card ${theme}`}>
      {children}
    </div>
  );
}
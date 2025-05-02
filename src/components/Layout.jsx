import { useContext } from 'react';
import {Link} from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { ThemeContext } from '../context/ThemeContext';
import './Layout.css';

export const Layout = ({ children }) => { 
    const { theme } = useContext(ThemeContext);   
    return ( 
        <div className={`App ${theme}`}>
            <header className={`App-header ${theme}`}>
                <div className={'App-logo'}>
                    <img
                        src={'/favicon.ico'}
                        alt="Logo"
                    />
                    <p>Movie Database</p>
                </div>            
                <nav>
                    <ul className={`Nav-list`} >
                        <li ><Link className={`Nav-link ${theme}`} to="/">Тренди тижня</Link></li>
                        <li ><Link className={`Nav-link ${theme}`}to="/movie">Сторінка пошуку</Link></li>                                                      
                    </ul>
                </nav>
                <ThemeToggle/>
            </header>        
            <main>{ children }</main>
        </div>        
    )
}
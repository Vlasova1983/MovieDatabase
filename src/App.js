import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { MoviePage } from "./pages/MoviePage";
import { HomePage } from "./pages/HomePage";
import { Layout } from "./components/Layout";


export default function App() {  
  return (
    <BrowserRouter  basename="/">
      <Layout>              
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/movie" element={<MoviePage/>}/>                       
          </Routes>
      </Layout>
    </BrowserRouter>        
  );
}
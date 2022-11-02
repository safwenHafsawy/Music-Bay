import React from "react";
import HomePage from "./components/homePage/home.jsx";
import Categories from "./components/categoriesList/categories.jsx";
import MusicPlayer from "./components/musicPlayer/musicPlayer.jsx";
import "./main.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/player" element={<MusicPlayer />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/homePage/home";
import Categories from "./components/categoriesList/categories";
import MusicPlayer from "./components/musicPlayer/musicPlayer";

import "./main.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/player" element={<MusicPlayer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

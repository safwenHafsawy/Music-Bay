import React from "react";
import HomePage from "./components/homePage/home.jsx";
import Categories from "./components/categoriesList/categories.jsx";
import "./main.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<Categories />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

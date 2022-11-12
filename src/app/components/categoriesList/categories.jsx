import React, { useState } from "react";
import { Link } from "react-router-dom";
import NaviagtionWrapper from "../navigation/NaviagationWrapper";
import { CategoriesSeparator } from "../illustrations/logosAndBg";
import "./categories.scss";

const AvailableGenre = [
  { id: 0, genre: "Rock" },
  { id: 1, genre: "Rap" },
  { id: 2, genre: "Jazz" },
  { id: 3, genre: "Country" },
  { id: 4, genre: "Lofi" },
];

function Categories() {
  const [currentlyDisplayed, setCurrentlyDisplay] = useState(2);
  const [prevDisplay, setPrevDisplay] = useState(1);
  const [nexDisplay, setNextDisplay] = useState(3);

  const changeGenre = (e) => {
    const id = parseInt(e.target.id, 10);
    setCurrentlyDisplay(id);
    if (id === 0) {
      setPrevDisplay(4);
      setNextDisplay(id + 1);
    } else if (id === 4) {
      setPrevDisplay(id - 1);
      setNextDisplay(0);
    } else {
      setPrevDisplay(id - 1);
      setNextDisplay(id + 1);
    }
  };

  return (
    <div id="categories">
      <div id="heading">
        <h1>what to you want to hear today ? </h1>
      </div>

      <div id="cards">
        <div id="separator">
          <CategoriesSeparator />
        </div>
        <button className="card-side" id={prevDisplay} type="button" onClick={changeGenre}>
          {AvailableGenre[prevDisplay].genre}
        </button>
        <Link
          to="/player"
          state={{ genre: AvailableGenre[currentlyDisplayed].genre }}
          className="card-main"
          id={currentlyDisplayed}
        >
          <h5 className="card-header">{AvailableGenre[currentlyDisplayed].genre}</h5>
        </Link>
        <button className="card-side" id={nexDisplay} type="button" onClick={changeGenre}>
          {AvailableGenre[nexDisplay].genre}
        </button>
      </div>
    </div>
  );
}

export default NaviagtionWrapper(Categories);

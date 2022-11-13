import React, { useState } from "react";
import { Link } from "react-router-dom";
import NaviagtionWrapper from "../navigation/NaviagationWrapper";
import { CategoriesSeparator, RightSwipe, LeftSwipe } from "../illustrations/logosAndBg";
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

  const changeGenre = (e) => {
    if (e.target.closest("#left-swipe")) {
      if (currentlyDisplayed > 0) setCurrentlyDisplay(currentlyDisplayed - 1);
      else setCurrentlyDisplay(4);
      return;
    }

    if (currentlyDisplayed === 4) setCurrentlyDisplay(0);
    else setCurrentlyDisplay(currentlyDisplayed + 1);
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
        <button className="card-side" id="left-swipe" type="button" onClick={changeGenre}>
          <LeftSwipe id="left-swipe=logo" />
        </button>
        <Link
          to="/player"
          state={{ genre: AvailableGenre[currentlyDisplayed].genre }}
          className="card-main"
          id={currentlyDisplayed}
        >
          <h5 className="card-header">{AvailableGenre[currentlyDisplayed].genre}</h5>
        </Link>
        <button className="card-side" id="right-swipe" type="button" onClick={changeGenre}>
          <RightSwipe id="right-swipe-logo" />
        </button>
      </div>
    </div>
  );
}

export default NaviagtionWrapper(Categories);

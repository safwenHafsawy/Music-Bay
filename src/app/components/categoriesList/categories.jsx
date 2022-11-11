import React from "react";
import { Link } from "react-router-dom";
import NaviagtionWrapper from "../navigation/NaviagationWrapper";
import "./categories.scss";

const AvailableCategs = [
  { id: 1, genre: "Rock" },
  { id: 2, genre: "Rap" },
  { id: 3, genre: "Jazz" },
  { id: 4, genre: "Country" },
  { id: 5, genre: "Lofi" },
];

function Categories() {
  return (
    <div id="categories">
      <h1>what to you want to hear today ? </h1>
      <div id="cards">
        {AvailableCategs.map((ele, i) => (
          <Link key={ele.id} to="/player" state={{ genre: ele.genre }} className="card" id={i}>
            <h5 className="card-header">{ele.genre}</h5>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default NaviagtionWrapper(Categories);

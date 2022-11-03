import React from "react";
import { Link } from "react-router-dom";
import "./categories.scss";

const AvailableCategs = ["Rock", "Rap", "Jazz", "Country", "Lofi"];

function Categories() {
  return (
    <div id="categories">
      <h1>what to you want to hear today ? </h1>
      <div id="cards">
        {AvailableCategs.map((ele, i) => (
          <Link to="/player" className="card" id={i}>
            <h5 className="card-header">{ele}</h5>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Categories;

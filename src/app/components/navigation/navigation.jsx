import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import propTypes from "prop-types";
import { BrandLogo } from "../illustrations/logosAndBg";
import "./navigation.scss";

function NavigationBar(props) {
  const [toggle, setToogle] = useState(false);
  const [navClass, setNavClass] = useState("");
  const { displayType } = props;

  useEffect(() => {
    if (displayType === "hamburger" && toggle) {
      setNavClass("show-hamburger-bar");
    } else if (displayType === "hamburger" && !toggle) {
      setNavClass("hide-hamburger-bar");
    } else {
      setNavClass(displayType);
    }
  });

  const setHamburgerNavigationToggle = () => {
    setToogle(!toggle);
  };

  return (
    <>
      <button
        type="button"
        className={displayType === "hamburger" ? "show-toggle" : "hide-toggle"}
        onClick={setHamburgerNavigationToggle}
      >
        <BrandLogo />
        <span>Music bay</span>
      </button>
      <nav className={navClass}>
        <div id="full-bar">
          <div id="brand">
            <BrandLogo />
            <h3>Music Bay</h3>
          </div>
          <div id="links">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/categories">Categories</Link>
              </li>
              <li>
                <Link to="/categories">Connect to spotify</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </div>
          <button
            type="button"
            className={displayType === "hamburger" ? "show-close" : "hide-close"}
            onClick={setHamburgerNavigationToggle}
          >
            &#9747; Close
          </button>
        </div>
      </nav>
    </>
  );
}

NavigationBar.propTypes = {
  displayType: propTypes.string,
};

NavigationBar.defaultProps = {
  displayType: "vista",
};
export default NavigationBar;

import React from "react";
import { Link } from "react-router-dom";
import "./home.scss";
import { HomeBG, HomeSeparator } from "../illustrations/logosAndBg";

export default function HomePage() {
  return (
    <div id="home-page">
      <div id="intro">
        <div id="home-headers-logo">
          <h1>Welcome to </h1>
          <h3>Home to your favorite music</h3>
          <HomeBG />
        </div>
        <div id="get-started-action">
          <button type="button">
            <a href="#get-started-options">Get Started</a>
          </button>
        </div>
        <div className="separator">
          <HomeSeparator />
        </div>
      </div>
      <div id="get-started-options">
        <div id="get-started-intro">
          <h4>
            We offer you the opportunity to listen and enjoy your favorite music
            either by listening to a set of music we selected for you or by
            connecting to your spotify and bringing you favorite songs to Music
            <span>Bay</span>
          </h4>
          <h1>So what are you choosing today ? </h1>
        </div>
        <div id="home-btns">
          <Link to="/categories">
            <button type="button">Start Listening now</button>
          </Link>
          <Link to="/categories">
            <button type="button">Connect To Spotify</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import "./home.scss";
import { HomeBG, HomeSeparator } from "../svgs/logosAndBg.jsx";

export default function HomePage() {
  return (
    <div id="home-page">
      <div id="intro">
        <div id="home-headers-logo">
          <h1>Welcome to Music </h1>
          <h2>Home to your favorite music</h2>
          <HomeBG />
        </div>
        <div id="get-started-action">
          <button>
            <a href="#get-started-options">Get Started</a>
          </button>
        </div>
        <div className="separator">
          <HomeSeparator />
        </div>
      </div>
      <div id="get-started-options">
        <div id="home-btns">
          <button>Start listening now</button>
          <button>Connect To Spotify</button>
        </div>
        <div className="separator">
          <HomeSeparator />
        </div>
      </div>
    </div>
  );
}

import React from "react";
import "./home.scss";
import homeAnimation from "../../../../public/imgs/home.gif";
import brand from "../../../../public/imgs/brand.svg";

export default function HomePage() {
    return (
        <div id="home-page">
            <div id="top-side">
                <div id="home-headers">
                    <h1>Welcome to Music bay</h1>
                    <div>
                        <img src={brand} alt="homelogo" />
                        <h2>Home to your favorite music</h2>
                    </div>
                </div>

            </div>
            <div id="bottom-side">
                <div id="home-btns">
                    <button>Start listening now</button>
                    <button>Connect To Spotify</button>
                </div>
            </div>
        </div>
    )
}
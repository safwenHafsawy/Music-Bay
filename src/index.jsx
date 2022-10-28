import React from "react";
import {createRoot} from "react-dom/client";
import App from "./app/app.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);
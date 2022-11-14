import React from "react";
import "./loading.scss";

function Loading() {
  return (
    <div id="loading-display">
      <div id="loader" />
      <span id="loader-details">Loading Music for you....</span>
    </div>
  );
}

export default Loading;

import React from "react";
import NavigationBar from "./navigation";

/**
 *
 * @param {React component}
 * @returns a function that returns a new upgraded component that contains the wrapped component along with appropriate navigation dispaly
 *
 */

function NaviagtionWrapper(WrappedComp) {
  return function _() {
    const { pathname } = window.location;
    let displayType;

    switch (pathname) {
      case "/player":
        displayType = "hamburger";
        break;
      default:
        displayType = "vista";
    }

    return (
      <>
        <NavigationBar displayType={displayType} />
        <WrappedComp />
      </>
    );
  };
}

export default NaviagtionWrapper;

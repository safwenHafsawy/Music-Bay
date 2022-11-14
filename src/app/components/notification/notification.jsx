import React from "react";
import propTypes from "prop-types";
import "./notification.scss";

function Notification(props) {
  const { notification } = props;

  return (
    <div id="notification">
      <span>{notification}</span>
    </div>
  );
}

Notification.propTypes = {
  notification: propTypes.string,
};

Notification.defaultProps = {
  notification: "",
};

export default Notification;

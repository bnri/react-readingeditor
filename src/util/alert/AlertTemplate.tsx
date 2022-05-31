// @ts-nocheck
import React from "react";
import "./AlertTemplate.css";
var BaseIcon = function BaseIcon(_ref) {
  var color = _ref.color,
    _ref$pushRight = _ref.pushRight,
    pushRight = _ref$pushRight === undefined ? true : _ref$pushRight,
    children = _ref.children;
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: { marginRight: pushRight ? "20px" : "0", minWidth: 24 },
    },
    children
  );
}; //alert.show

var InfoIcon = function InfoIcon() {
  return React.createElement(
    BaseIcon,
    {
      //color: '#2E9AFE'
      color: "white",
    },
    React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
    React.createElement("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
    React.createElement("line", { x1: "12", y1: "8", x2: "12", y2: "8" })
  );
}; //alert.info

var SuccessIcon = function SuccessIcon() {
  return React.createElement(
    BaseIcon,
    {
      //color: '#31B404' //초록
      color: "white",
    },
    React.createElement("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
    React.createElement("polyline", { points: "22 4 12 14.01 9 11.01" })
  );
}; //alert.success

var ErrorIcon = function ErrorIcon() {
  return React.createElement(
    BaseIcon,
    { color: "#FF0040" },
    React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
    React.createElement("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
    React.createElement("line", { x1: "12", y1: "16", x2: "12", y2: "16" })
  );
}; //alert.error

var CloseIcon = function CloseIcon() {
  return React.createElement(
    BaseIcon,
    { color: "#FFFFFF", pushRight: false },
    React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
    React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
  );
};

var _extends =
  Object.assign ||
  function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

var alertStyle = {
  backgroundColor: "#7367f0", //보라색
  color: "white",
  padding: "10px",
  textTransform: "uppercase",
  borderRadius: "3px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.03)",
  fontFamily: "Arial",
  width: "350px",
  maxWidth: "95vw",
  boxSizing: "border-box",
};

var buttonStyle = {
  marginLeft: "20px",
  border: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
  color: "#FFFFFF",
  outline: "none",
};

const breakLine = (text) => {
  if (text) {
    text = text + "";

    let arr = text.split("\n");

    let data = [];
    for (let i = 0; i < arr.length; i++) {
      data.push(arr[i]);
      if (i + 1 !== arr.length) {
        data.push(
          React.createElement("br", {
            key: "alertbr" + i,
          })
        );
      }
    }

    return data;
  } else {
    return "오류";
  }

  /*
  var br = React.createElement('br');
  var regex = /(<br \/>)/g;
  return text.split(regex).map(function(line, index) {
      return line.match(regex) ? <br key={"key_" + index} /> : line;
  });
  */
};

var AlertTemplate = function AlertTemplate(_ref) {
  var message = _ref.message,
    options = _ref.options,
    style = _ref.style,
    close = _ref.close;

  //console.log(message);
  //  console.log(breakLine(message));

  return React.createElement(
    "div",
    {
      style: _extends({}, alertStyle, style),
      className: "no-drag",
    },
    options.type === "info" && React.createElement(InfoIcon, null),
    options.type === "success" && React.createElement(SuccessIcon, null),
    options.type === "error" && React.createElement(ErrorIcon, null),

    React.createElement(
      "span",
      {
        style: { flex: 2, cursor: "default" },
      },
      breakLine(message)
    ),
    React.createElement(
      "button",
      { onClick: close, style: buttonStyle, className: "alertClose" },
      React.createElement(CloseIcon, null)
    )
  );
};

export default AlertTemplate;

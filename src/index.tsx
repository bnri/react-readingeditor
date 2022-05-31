import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import AlertTemplate from "./util/alert/AlertTemplate";
// @ts-ignore
import { positions, Provider as AlertProvider } from "react-alert";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const alertOptions = {
  timeout: 2000,
  //  position:positions.BOTTOM_CENTER
  position: positions.TOP_CENTER,
  containerStyle: {
    zIndex: 2000,
  },
};

ReactDOM.render(
  <React.StrictMode>
    <AlertProvider template={AlertTemplate} {...alertOptions}>
      <App Swal={MySwal} />
    </AlertProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

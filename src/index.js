import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import GlobalDataProvider from "./context/GlobalData";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "./main.scss";
const root = document.querySelector("#root");
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalDataProvider>
        <App />
      </GlobalDataProvider>
    </BrowserRouter>
  </React.StrictMode>,
  root
);
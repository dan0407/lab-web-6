import React from "react";
import ReactDOM from "react-dom/client"; // Importa desde "react-dom/client"
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // Crea el root
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
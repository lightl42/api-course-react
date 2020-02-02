// Les imports importants
import React from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import InvoicesPage from "./pages/InvoicesPage";
import CustomersPage from "./pages/CustomersPage";
import CustomersPageWithPagination from "./pages/CustomersPageWithPagination";
import { HashRouter, Switch, Route } from 'react-router-dom';

/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import "../css/app.css";

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

// console.log("Hello Webpack Encore! Edit me in assets/js/app.js");

// Le HashRouter va rajouter un # a l'URL localhost:8000/# pour eviter a Symfony de reprendre le controle (http://localhost:8000/#/customers != http://localhost:8000/#/customers)
// http://localhost:8000/#/customers
// http://localhost:8000/#/invoices

// Switch : En fonction de l'adresse, afficher le bon composant ; aller du plus detaille au plus general
// Route : Fait la correspondance entre une URL (route) et un composant / affichage

const App = () => {
  return (
    <HashRouter>
      <Navbar />
      <main className="container pt-5">
        <Switch>
            <Route path="/invoices" component={InvoicesPage} />
            <Route path="/customers" component={CustomersPage} />
            <Route path="/" component={HomePage} />
        </Switch>
      </main>
    </HashRouter>
  );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);

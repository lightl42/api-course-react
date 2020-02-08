// Les imports importants
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom"; // withRouter : retourne le composant qu'on lui donne en lui donnant les props du routeur !
/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
// any CSS you import will output into a single css file (app.css in this case)
import "../css/app.css";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AuthContext from "./contexts/AuthContext";
import CustomersPage from "./pages/CustomersPage";
import CustomerPage from "./pages/CustomerPage";
import HomePage from "./pages/HomePage";
import InvoicesPage from "./pages/InvoicesPage";
import InvoicePage from "./pages/InvoicePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { default as AuthAPI, default as authAPI } from "./services/authAPI";


// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

// console.log("Hello Webpack Encore! Edit me in assets/js/app.js");

// Le HashRouter va rajouter un # a l'URL localhost:8000/# pour eviter a Symfony de reprendre le controle (http://localhost:8000/#/customers != http://localhost:8000/#/customers)
// http://localhost:8000/#/customers
// http://localhost:8000/#/invoices

// Switch : En fonction de l'adresse, afficher le bon composant ; aller du plus detaille au plus general
// Route : Fait la correspondance entre une URL (route) et un composant / affichage

authAPI.setup();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  );

  // Composant Navbar doté des props du Router grace a withRouter !
  const NavbarWithRouter = withRouter(Navbar);

  // <Redirect /> permet de rediriger le Router sur une autre adresse

  // AuthContext va prendre une valeur qui sera l'objet pour l'authentification ; AuthContext.Provider va fournir aux autres composants enfants cet objet
  // Evite de passer les memes props a tous mes composants pour l'authentification
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <HashRouter>
        <NavbarWithRouter />
        <main className="container pt-5">
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <PrivateRoute path="/invoices/:id" component={InvoicePage} />
            <PrivateRoute path="/invoices" component={InvoicesPage} />
            <PrivateRoute path="/customers/:id" component={CustomerPage} />
            <PrivateRoute path="/customers" component={CustomersPage} />
            <Route path="/" component={HomePage} />
          </Switch>
        </main>
      </HashRouter>
    </AuthContext.Provider>
  );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);

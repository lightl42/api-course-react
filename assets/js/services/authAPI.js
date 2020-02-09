import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from "../config";

/**
 * Déconnexion (suppression du token du localStorage et sur Axios)
 */
function logout() {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
}

/**
 * Requête HTTP d'authentification et stockage du token dans le storage et sur Axios
 * @param {object} credentials
 */
function authenticate(credentials) {
  return axios
    .post(LOGIN_API, credentials)
    .then(response => response.data.token)
    .then(token => {
      // Stocker le token dns le localStorage
      window.localStorage.setItem("authToken", token);
      // On previent Axios qu'on a maintenant un header par defaut sur toutes nos futures requetes HTTP
      setAxiosToken(token);
    });
}

/**
 * Positionne le token JWT sur Axios
 * @param {string} token
 */
function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

// npm install jwt-decode : Regarder un token et le decoder
// Appeler cette fonction avant la creation de mon composant <App/>
/**
 * Mise en place lors du chargement de l'app
 */
function setup() {
  // Recuperer le token
  const token = window.localStorage.getItem("authToken");
  if (token) {
    // Si le token existe, le decoder avec jwt-decode
    const { exp: expiration } = jwtDecode(token);
    // Si la date d'expiration est superieure a la date actuelle
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
    }
  }
}

// Retourne true si on et authentifie sinon false
/**
 * Permet de savoir si on est authentifie ou pas
 * @return boolean
 */
function isAuthenticated() {
  const token = window.localStorage.getItem("authToken");
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      return true;
    }
    return false;
  }
  return false;
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated
};

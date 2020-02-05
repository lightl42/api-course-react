import React, { useState, useContext } from "react";
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";

// history : props du Router (react-router-dom)
// history.push() => Ajoute une adresse a l'historique de navigation ; history.replace() => Remplace l'adresse actuelle a l'historique de navigation
const LoginPage = ({ history }) => {

  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");

  // Gestion des champs
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    // [name] va etre interprete comme une variable ("username"), sinon sans les crochets il va s'ajouter au state (en plus de username et password)
    setCredentials({ ...credentials, [name]: value });
  };

  // Gestion du submit
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      await AuthAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      history.replace("/customers");
    } catch (error) {
      // console.log(error.response);
      setError(
        "Aucun compte ne possede cette adresse ou alors les informations ne correspondent pas"
      );
    }
    console.log(credentials);
  };

  return (
    <>
      <h1>Connexion a l'application</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username"></label>
          <input
            value={credentials.username}
            onChange={handleChange}
            type="email"
            placeholder="Adresse email de connexion"
            id="username"
            name="username"
            className={"form-control" + (error && " is-invalid")}
          />
          {error && <p className="invalid-feedback">{error}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password"></label>
          <input
            value={credentials.password}
            onChange={handleChange}
            type="password"
            placeholder="Mot de passe"
            id="password"
            name="password"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Je me connecte
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;

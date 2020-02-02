import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";

/**
 * Classe pour la pagination en temps reel via l'API
 * @param {*} props
 */

const CustomersPageWithPagination = props => {
  // Creer un State (customers) et une fonction de modification de ce State (setCustomers)
  const [customers, setCustomers] = useState([]); // valeur par defaut de customers : Un tableau vide []
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  // Hook pour creer un "side effect"
  // le second parametre est un tableau contenant la variable qu'on surveille qui enclenchera un effet lorsqu'elle change ; [] on ne surveille pas de variable l'effet sera donc lancé une seule fois a l'affichage du composant
  useEffect(() => {
    // .get() => declencher une requete HTTP GET sur localhost:8000/api/customers
    // .then() => une fois l'action precedente terminee faire ...
    axios
      .get(
        `http://localhost:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`
      )
      .then(response => {
        setCustomers(response.data["hydra:member"]);
        setTotalItems(response.data["hydra:totalItems"]);
        setLoading(false);
      })
      .catch(error => console.log(error.response)); // en cas d'erreur
  }, [currentPage]); // Faire cette action a chaque fois que currentPage va changer

  const handleDelete = id => {
    // Copie originale du tableau des customers
    const originalCustomers = [...customers];

    // On suppose que la suppression se deroulera bien (supprime d'abord dans la liste et après au niveau du serveur)
    setCustomers(customers.filter(customer => customer.id !== id));

    axios
      .delete("http://localhost:8000/api/customers" + id)
      .then(response => console.log("Ok"))
      .catch(error => {
        setCustomers(originalCustomers); // Si ca se passe mal (erreur), on remet le tableau d'origine !
        console.log(error.response);
      });
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    setLoading(true);
  };

  const paginatedCustomers = Pagination.getData(
    customers,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <h1>Liste des clients (pagination)</h1>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Factures</th>
            <th className="text-center">Montant total</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td>Chargement ...</td>
            </tr>
          )}
          {!loading &&
            customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <a href="#">
                    {customer.firstName} {customer.lastName}
                  </a>
                </td>
                <td>{customer.email}</td>
                <td>{customer.company}</td>
                <td className="text-center">
                  <span className="badge badge-primary">
                    {customer.invoices.length}
                  </span>
                </td>
                <td className="text-center">
                  {customer.totalAmount.toLocaleString()} €
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    disabled={customer.invoices.length > 0}
                    className="btn btn-sm btn-danger"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={totalItems}
        onPageChanged={handlePageChange}
      />
    </>
  );
};

export default CustomersPageWithPagination;

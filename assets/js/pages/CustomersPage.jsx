import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

/**
 * Classe pour la pagination en Javascript (plus reactif)
 * @param {*} props
 */
const CustomersPage = props => {
  // Creer un State (customers) et une fonction de modification de ce State (setCustomers) ; valeur par defaut de customers : Un tableau vide []
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  // Permet d'aller recuperer les customers
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      toast.error("Impossible de charger les clients");
    }
  };

  // Au chargement du composant, on va chercher les customers
  // useEffect : Hook pour creer un "side effect" ; le second parametre est un tableau contenant la variable qu'on surveille qui enclenchera un effet lorsqu'elle change ; [] on ne surveille pas de variable l'effet sera donc lancé une seule fois a l'affichage du composant
  useEffect(
    () => {
      fetchCustomers();
    },
    /*
      CustomersAPI.findAll()
      // .get() => declencher une requete HTTP GET sur localhost:8000/api/customers
      .then(data => setCustomers(data))
      // .then() => une fois l'action precedente terminee faire ...  
      .catch(error => console.log(error.response));
    */
    []
  );

  // Gestion de la suppression d'un customer ; ajouter le mot-cle "async" (fonctionne de pair avec "await") pour signifier que c'est une fonction asynchrone
  const handleDelete = async id => {
    // Copie originale du tableau des customers
    const originalCustomers = [...customers];

    // On suppose que la suppression se deroulera bien (supprime d'abord dans la liste et après au niveau du serveur)
    setCustomers(customers.filter(customer => customer.id !== id));

    // Supprimer un customer ; utiliser une logique synchrone (Async, Await) plutôt qu'une logique asynchrone avec les promesses (ici delete()) ; .then() et .catch() ; comme cela renvoi une promesse, il faut ajouter le mot-cle "await"
    try {
      await CustomersAPI.delete(id);
      toast.success("Le client " + id + " a bien été supprimé");
    } catch (error) {
      // Si ca se passe mal (erreur), on remet le tableau d'origine !
      setCustomers(originalCustomers);
      toast.error("La suppression du client n'a pas pu fonctionner");
    }
    /*
    CustomersAPI.delete(id)
      .then(response => console.log("Ok"))
      .catch(error => {
        setCustomers(originalCustomers);
        console.log(error.response);
      });
    */
  };

  // Gestion du changement de page
  const handlePageChange = page => setCurrentPage(page);

  // Gestion de la recherche ; on "destructure" l'event (const handleSearch = event => {...}) pour n'avoir que la currentTarget
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  // Filtrage des customers en fonction de la recherche
  const filteredCustomers = customers.filter(
    c =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination des donnees
  const paginatedCustomers = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des clients</h1>
        <Link to="/customers/new" className="btn btn-primary">
          Créer un client
        </Link>
      </div>

      <div className="form-group">
        <input
          type="text"
          onChange={handleSearch}
          value={search}
          className="form-control"
          placeholder="Rechercher ..."
        />
      </div>

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
        {!loading && (
          <tbody>
            {paginatedCustomers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <Link to={"/customers/" + customer.id}>
                    {customer.firstName} {customer.lastName}
                  </Link>
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
        )}
      </table>

      {loading && <TableLoader />}

      {itemsPerPage < filteredCustomers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  );
};

export default CustomersPage;

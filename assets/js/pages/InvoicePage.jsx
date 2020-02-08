import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import CustomersAPI from "../services/customersAPI";
import InvoicesAPI from "../services/invoicesAPI";

const InvoicePage = ({ history, match }) => {
  const { id = "new" } = match.params;

  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT"
  });

  const [customers, setCustomers] = useState([]);

  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: ""
  });

  // State pour savoir si on est en modification ou pas
  const [editing, setEditing] = useState(false);

  // Recuperation des clients
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      // Donner a notre invoice le 1er customer qu'on a chargé
      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
      console.log(error.response);
      history.replace("/invoices");
    }
  };

  // Recuperation d'une facture
  const fetchInvoice = async id => {
    try {
      const { amount, status, customer } = await InvoicesAPI.find(id);
      setInvoice({ amount, status, customer: customer.id });
    } catch (error) {
      // TODO : Notification flash d'une erreur
      history.replace("/invoices");
    }
  };

  // Recuperation de la liste des clients a chaque chargement du composant
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Recuperation de la bonne facture quand l'identifiant de l'URL change
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchInvoice(id);
    }
  }, [id]);

  // Gestion des changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async event => {
    event.preventDefault();
    if (editing) {
      await InvoicesAPI.update(id, invoice);
    } else {
      await InvoicesAPI.create(invoice);
      // TODO : Flash notification succes
      history.replace("/invoices");
    }
    try {
    } catch (error) {
      const { violations } = error.response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
        // TODO : Flash notification d'erreurs
      }
    }
  };

  return (
    <>
      {(editing && <h1>Modification d'une facture</h1>) || (
        <h1>Création d'une facture</h1>
      )}
      <form onSubmit={handleSubmit}>
        <Field
          name="amount"
          type="number"
          placeholder="Montant de la facture"
          onChange={handleChange}
          label="Montant"
          value={invoice.amount}
          error={errors.amount}
        />
        <Select
          name="customer"
          label="Client"
          value={invoice.customer}
          error={errors.customer}
          onChange={handleChange}
        >
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </Select>
        <Select
          name="status"
          label="Statut"
          value={invoice.status}
          error={errors.status}
          onChange={handleChange}
        >
          <option value="SEND">Envoyé</option>
          <option value="PAID">Payé</option>
          <option value="CANCELLED">Annulée</option>
        </Select>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/invoices" className="btn btn-link">
            Retour à la liste
          </Link>
        </div>
      </form>
    </>
  );
};

export default InvoicePage;

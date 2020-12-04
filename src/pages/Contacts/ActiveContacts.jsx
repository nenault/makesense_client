import React, { Component } from "react";
import apiHandler from "../../api/apiHandler";
import { Link } from "react-router-dom";
import SearchBar from "../../components/Forms/SearchBar";

class ActiveContacts extends Component {
  state = {
    contacts: [],
    searchContacts: [],
  };

  componentDidMount() {
    apiHandler
      .getAll("/api/contacts")
      .then((apiRes) => {
        this.setState({ contacts: apiRes.data, searchContacts: apiRes.data });
      })
      .catch((apiErr) => {
        console.log(apiErr);
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props.isUpdating !== prevProps.isUpdating) {
      apiHandler
        .getAll("/api/contacts")
        .then((apiRes) => {
          this.setState({ contacts: apiRes.data, searchContacts: apiRes.data });
          this.props.stopUpdating();
        })
        .catch((apiErr) => {
          console.log(apiErr);
        });
    }
  }

  deleteOne(id) {
    apiHandler
      .deleteOne("/api/contacts/", id)
      .then((apiRes) => this.componentDidMount())
      .catch((apiErr) => console.log(apiErr));
  }

  disableOne(id) {
    apiHandler
      .updateOne("/api/contacts/" + id, {
        isActive: false,
      })
      .then((apiRes) => {
        apiHandler
          .getAll("/api/contacts")
          .then((apiRes) => {
            this.setState({
              contacts: apiRes.data,
              searchContacts: apiRes.data,
            });
            this.props.updating();
          })
          .catch((apiErr) => {
            console.log(apiErr);
          });
      })
      .catch((apiErr) => console.log(apiErr));
  }

  formatDate(date) {
    const getDate = date.split("T")[0].split("-");
    const formatedDate = `${getDate[2]}-${getDate[1]}-${getDate[0]}`;
    // return `${date[2]}-${date[1]}-${date[0]}`;
    return formatedDate;
  }

  search = (searchContact) => {
    const copyContacts = [...this.state.contacts];

    // return product.name.toLowerCase().includes(props.name.toLowerCase())

    const filteredContacts = copyContacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchContact.search.toLowerCase())
    );
    this.setState({ searchContacts: filteredContacts });
  };

  render() {
    if (!this.state.contacts) {
      return <div>Loading</div>;
    }

    const contacts = this.state.searchContacts.filter(
      (contact) => contact.isActive === true
    );

    return (
      <div className="contacts-active">
        <h3 style={{ marginBottom: "10px", color: "#e36164" }}>
          {contacts.length} contact{contacts.length > 1 ? "s" : ""} actif
          {contacts.length > 1 ? "s" : ""}
        </h3>
        <SearchBar handleSearch={this.search} type="contact" />
        <table>
          <thead>
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">
                Dernier
                <br />
                appel
              </th>
              <th scope="col">Fréquence</th>
              <th scope="col">Editer</th>
              <th scope="col">Désactiver</th>
              <th scope="col">Supprimer</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td scope="row" data-label="Nom">
                  <Link to={`/contacts/${contact._id}/`}>{contact.name}</Link>
                </td>
                <td data-label="Dernier appel">
                  <Link to={`/contacts/${contact._id}/`}>
                    {contact.lastcall
                      ? this.formatDate(contact.lastcall)
                      : "Aucun appel"}
                  </Link>
                </td>
                <td data-label="Fréquence">
                  <Link to={`/contacts/${contact._id}/`}>
                    {contact.frequency}
                  </Link>
                </td>
                <td data-label="Editer">
                  <Link to={`/contacts/${contact._id}/edit`}>
                    <i className="fas fa-edit"></i>
                  </Link>
                </td>
                <td data-label="Désactiver">
                  <Link
                    to={this.props}
                    onClick={() => this.disableOne(contact._id)}
                  >
                    <i className="fas fa-user-times"></i>
                  </Link>
                </td>
                <td data-label="Supprimer">
                  <Link
                    to={this.props}
                    onClick={() => this.deleteOne(contact._id)}
                  >
                    <i className="fas fa-backspace"></i>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ActiveContacts;

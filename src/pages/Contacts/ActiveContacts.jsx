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
        this.isCallNeeded();
      })
      .catch((apiErr) => {
        console.log(apiErr);
      });
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
      .then((apiRes) => {})
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
        <h2>Contacts actifs</h2>
        <SearchBar handleSearch={this.search} />
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Dernier appel</th>
              <th>frequence</th>
              <th>Voir</th>
              <th>Editer</th>
              <th>Désactiver</th>
              <th>Supprimer</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.name}</td>
                <td>
                  {contact.lastcall
                    ? this.formatDate(contact.lastcall)
                    : "never"}
                </td>
                <td>{contact.frequency}</td>
                <td>
                  <Link to={`/contacts/${contact._id}/`}>
                    <i className="fas fa-info-circle"></i>
                  </Link>
                </td>
                <td>
                  <Link to={`/contacts/${contact._id}/edit`}>
                    <i className="fas fa-edit"></i>
                  </Link>
                </td>
                <td>
                  <Link
                    to={this.props}
                    onClick={() => this.disableOne(contact._id)}
                  >
                    <i className="fas fa-user-times"></i>
                  </Link>
                </td>
                <td>
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

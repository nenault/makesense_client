import React, { Component } from "react";
import apiHandler from "../../api/apiHandler";
import { Link } from "react-router-dom";
import SearchBar from "../../components/Forms/SearchBar";

class InactiveContacts extends Component {
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

  activeOne(id) {
    apiHandler
      .updateOne("/api/contacts/" + id, {
        isActive: true,
      })
      .then((apiRes) => {
        apiHandler
          .getAll("/api/contacts")
          .then((apiRes) => {
            this.setState({ contacts: apiRes.data });
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

    const InactiveContacts = this.state.searchContacts.filter(
      (contact) => contact.isActive === false
    );

    return (
      <div className="contacts-inactive">
        <h3 style={{ marginBottom: "10px", color: "#e36164" }}>
          Contacts inactifs
        </h3>
        <SearchBar handleSearch={this.search} />
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Dernier appel</th>
              <th>Editer</th>
              <th>Activer</th>
              <th>Supprimer</th>
            </tr>
          </thead>
          <tbody>
            {InactiveContacts.map((contact) => (
              <tr key={contact._id}>
                <td>
                  <Link to={`/contacts/${contact._id}/`}>{contact.name}</Link>
                </td>
                <td>
                  <Link to={`/contacts/${contact._id}/`}>
                    {contact.lastcall
                      ? this.formatDate(contact.lastcall)
                      : "never"}
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
                    onClick={() => this.activeOne(contact._id)}
                  >
                    <i className="fas fa-user-plus"></i>
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

export default InactiveContacts;

import React, { Component } from "react";
import apiHandler from "../../api/apiHandler";
import { Link } from "react-router-dom";

class InactiveContacts extends Component {
  state = {
    contacts: [],
  };

  componentDidMount() {
    apiHandler
      .getAll("/api/contacts")
      .then((apiRes) => {
        this.setState({ contacts: apiRes.data });
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

  activeOne(id) {
    apiHandler
      .updateOne("/api/contacts/" + id, {
        isActive: true,
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

  render() {
    if (!this.state.contacts) {
      return <div>Loading</div>;
    }

    const InactiveContacts = this.state.contacts.filter(
      (contact) => contact.isActive === false
    );
    return (
      <div className="contacts-inactive">
        <h2>Contacts inactifs</h2>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Dernier appel</th>
              <th>Voir</th>
              <th>Editer</th>
              <th>Activer</th>
              <th>Supprimer</th>
            </tr>
          </thead>
          <tbody>
            {InactiveContacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.name}</td>
                <td>
                  {contact.lastcall
                    ? this.formatDate(contact.lastcall)
                    : "never"}
                </td>
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

import React, { Component } from "react";
import apiHandler from "../../api/apiHandler";
import SearchBar from "../../components/Forms/SearchBar";
import { Link } from "react-router-dom";

class NeedCallContacts extends Component {
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

  isCallNeeded() {
    for (const [index, item] of this.state.contacts.entries()) {
      if (item.lastcall) {
        let lastcall = new Date(item.lastcall);
        let today = new Date();

        let dateDiff = lastcall.getTime() - today.getTime();
        let days = Math.ceil(dateDiff / (1000 * 3600 * 24));
        // console.log(days);

        if (item.frequency === "Chaque jour" && days === -1) {
          apiHandler
            .updateOne("/api/contacts/" + item._id, {
              needcall: true,
            })
            .then((apiRes) =>
              apiHandler
                .getAll("/api/contacts")
                .then((apiRes) => {
                  this.setState({ contacts: apiRes.data });
                })
                .catch((apiErr) => {
                  console.log(apiErr);
                })
            )
            .catch((apiErr) => console.log(apiErr));
        } else if (item.frequency === "2 fois par semaine" && days === -3) {
          apiHandler
            .updateOne("/api/contacts/" + item._id, {
              needcall: true,
            })
            .then((apiRes) =>
              apiHandler
                .getAll("/api/contacts")
                .then((apiRes) => {
                  this.setState({ contacts: apiRes.data });
                })
                .catch((apiErr) => {
                  console.log(apiErr);
                })
            )
            .catch((apiErr) => console.log(apiErr));
        } else if (item.frequency === "1 fois par semaine" && days === -7) {
          apiHandler
            .updateOne("/api/contacts/" + item._id, {
              needcall: true,
            })
            .then((apiRes) =>
              apiHandler
                .getAll("/api/contacts")
                .then((apiRes) => {
                  this.setState({ contacts: apiRes.data });
                })
                .catch((apiErr) => {
                  console.log(apiErr);
                })
            )
            .catch((apiErr) => console.log(apiErr));
        }
      }
    }

    const needCallContacts = this.state.contacts.filter(
      (contact) =>
        contact.needcall === true &&
        contact.isActive === true &&
        contact.type != "eMail"
    );
    this.setState({ searchContacts: needCallContacts });
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
    return (
      <div className="contacts-needcall">
        <h3 style={{ marginBottom: "10px", color: "#e36164" }}>
          {this.state.searchContacts.length} contacts attendent nos appels
        </h3>
        <SearchBar handleSearch={this.search} />
        <table>
          <thead>
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">Dernier Appel</th>
              <th scope="col">Fréquence d'appel</th>
            </tr>
          </thead>
          <tbody>
            {this.state.searchContacts.map((contact) => (
              <tr key={contact._id}>
                <td scope="row" data-label="Nom">
                  <Link to={`/contacts/${contact._id}/`}>{contact.name}</Link>
                </td>
                <td data-label="Dernier Appel">
                  <Link to={`/contacts/${contact._id}/`}>
                    {contact.lastcall
                      ? this.formatDate(contact.lastcall)
                      : "never"}
                  </Link>
                </td>
                <td data-label="Fréquence d'appel">
                  <Link to={`/contacts/${contact._id}/`}>
                    {contact.frequency}
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

export default NeedCallContacts;

import React, { Component } from "react";
import apiHandler from "../../api/apiHandler.js";
import { UserContext } from "../../components/Auth/UserContext";
import { Link } from "react-router-dom";
import SearchBar from "../../components/Forms/SearchBar";

class Mycontacts extends Component {
  static contextType = UserContext;

  state = {
    mycontacts: [],
  };

  componentDidMount() {
    apiHandler
      .getOne("/api/users/", this.context.user._id)
      .then((apiRes) => {
        // console.log("fdsfds");
        // this.setState({ mycontacts: apiRes.data.contacts });
        this.getContacts(apiRes.data.contacts);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getContacts = (data) => {
    const contactsArr = [];
    for (const [index, item] of data.entries()) {
      // console.log(item.contact);
      apiHandler
        .getOne("/api/contacts/", item.contact)
        .then((apiRes) => {
          // console.log(apiRes.data);
          contactsArr.push(apiRes.data);
          this.setState({ mycontacts: contactsArr });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  formatDate(date) {
    const getDate = date.split("T")[0].split("-");
    const formatedDate = `${getDate[2]}-${getDate[1]}-${getDate[0]}`;
    // return `${date[2]}-${date[1]}-${date[0]}`;
    return formatedDate;
  }

  search = (searchContact) => {
    return null;
  };

  render() {
    return (
      <div className="contacts-mycontacts">
        <h3 style={{ marginBottom: "10px", color: "#e36164" }}>Mes contacts</h3>
        <SearchBar handleSearch={this.search} type="contact" />
        <table>
          <thead>
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">Dernier appel</th>
              <th scope="col">Fréquence d'appel</th>
            </tr>
          </thead>
          <tbody>
            {this.state.mycontacts.map((contact) => (
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

export default Mycontacts;

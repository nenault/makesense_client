import React, { Component } from "react";
import apiHandler from "../../api/apiHandler.js";
import { UserContext } from "../../components/Auth/UserContext";
import { Link } from "react-router-dom";


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

  render() {
    return (
      <div>
        <h2>Mes contacts</h2>
        <table>
          <thead>
            <tr>
              <th>nom</th>
              <th>last call</th>
              <th>frequence</th>
              <th>see</th>
            </tr>
          </thead>
          <tbody>
            {this.state.mycontacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.name}</td>
                <td>
                  {contact.lastcall
                    ? this.formatDate(contact.lastcall)
                    : "never"}
                </td>
                <td>{contact.frequency}</td>
                <td>
                  <Link to={`/contacts/${contact._id}/`}>see</Link>
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

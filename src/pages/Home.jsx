import React, { Component } from "react";
import { Link } from "react-router-dom";
import apiHandler from "../api/apiHandler.js";
import { UserContext } from "../components/Auth/UserContext";
import Mycontacts from "./Contacts/Mycontacts.jsx";
import NeedCallContacts from "./Contacts/NeedCallContacts.jsx";
import NeedWriteContacts from "./Contacts/NeedWriteContacts.jsx";

class Home extends Component {
  static contextType = UserContext;

  state = {
    contacts: [],
  };

  componentDidMount() {
    apiHandler
      .getAll("/api/contacts")
      .then((apiRes) => {
        this.setState({ contacts: apiRes.data });
        this.setInstitution();
      })
      .catch((apiErr) => {
        console.log(apiErr);
      });
  }

  setInstitution = () => {
    for (const contact of this.state.contacts) {
      if (contact.institution_code && !contact.institution) {
        apiHandler
          .getAll("/api/institutions/")
          .then((apiRes) => {
            const filteredInstitutions = apiRes.data.filter((institution) =>
              institution.code.includes(contact.institution_code)
            );
            apiHandler
              .updateOne("/api/contacts/" + contact._id, {
                institution: filteredInstitutions[0]._id,
              })
              .then((apiRes) => {})
              .catch((apiErr) => console.log(apiErr));
          })
          .catch((apiErr) => {
            console.log(apiErr);
          });
      }
    }
  };

  render() {
    return (
      <div className="home page">
       
        <div className="contacts-home">
        {this.context.user && this.context.user.contacts.length > 0 ? (
          <Mycontacts />
        ) : (
          ""
        )}
          <NeedCallContacts />
          <NeedWriteContacts />
        </div>
      </div>
    );
  }
}

export default Home;

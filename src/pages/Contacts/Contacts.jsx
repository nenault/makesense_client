import React, { Component } from "react";
import ActiveContacts from "./ActiveContacts";
import InactiveContacts from "./InactiveContacts";
import { Link } from "react-router-dom";

class Contacts extends Component {
  state = {
    isUpdating: false,
  };

  updating = (event) => {
    this.setState({ isUpdating: true });
  };

  stopUpdating = (event) => {
    this.setState({ isUpdating: false });
  };

  render() {
    // console.log(this.state.isUpdating);
    return (
      <div className="page">
      <h1>Les contacts</h1>
        <Link className="btn red" to={"/contacts/create"}>
          Ajouter un contact
        </Link>
        <div className="contacts-admin">
          <ActiveContacts
            isUpdating={this.state.isUpdating}
            updating={this.updating}
            stopUpdating={this.stopUpdating}
          />
          <InactiveContacts
            isUpdating={this.state.isUpdating}
            updating={this.updating}
            stopUpdating={this.stopUpdating}
          />
        </div>
      </div>
    );
  }
}

export default Contacts;

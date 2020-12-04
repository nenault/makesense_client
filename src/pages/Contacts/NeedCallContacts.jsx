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
        this.getNeedCallContacts(apiRes.data);
        this.isCallNeeded(apiRes.data);
      })
      .catch((apiErr) => {
        console.log(apiErr);
      });
  }

  isCallNeeded(data) {
    for (const [index, item] of data.entries()) {
      if (item.lastcall) {
        let lastcall = new Date(item.lastcall);
        let today = new Date();
        const getHour = today.getHours();

        // apiHandler
        // .updateOne("/api/contacts/" + item._id, {
        //   isTime: true,
        // })
        // .then((apiRes) => {console.log(apiRes);})
        // .catch((apiErr) => console.log(apiErr));

        // if (getHour > 14 && item.time === "afternoon") {
        //   apiHandler
        //     .updateOne("/api/contacts/" + item._id, {
        //       isTime: true,
        //     })
        //     .then((apiRes) => {})
        //     .catch((apiErr) => console.log(apiErr));
        // } else if (getHour < 14 && item.time === "morning") {
        //   apiHandler
        //     .updateOne("/api/contacts/" + item._id, {
        //       isTime: true,
        //     })
        //     .then((apiRes) => {})
        //     .catch((apiErr) => console.log(apiErr));
        // } else if (item.time === "all") {
        //   apiHandler
        //     .updateOne("/api/contacts/" + item._id, {
        //       isTime: true,
        //     })
        //     .then((apiRes) => {})
        //     .catch((apiErr) => console.log(apiErr));
        // } else {
        //   apiHandler
        //     .updateOne("/api/contacts/" + item._id, {
        //       isTime: false,
        //     })
        //     .then((apiRes) => {})
        //     .catch((apiErr) => console.log(apiErr));
        // }

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
                  // this.setState({ contacts: apiRes.data });
                  this.getNeedCallContacts(apiRes.data);
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
                  this.getNeedCallContacts(apiRes.data);
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
                  this.getNeedCallContacts(apiRes.data);
                })
                .catch((apiErr) => {
                  console.log(apiErr);
                })
            )
            .catch((apiErr) => console.log(apiErr));
        }
      }
    }
  }

  getNeedCallContacts(contacts) {
    const needCallContacts = contacts.filter(
      (contact) =>
        contact.needcall === true &&
        contact.isActive === true &&
        contact.type != "eMail"
    );
    this.setState({
      contacts: needCallContacts,
      searchContacts: needCallContacts,
    });
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

    const randomOrder = this.state.searchContacts.sort(
      () => Math.random() - 0.5
    );

    return (
      <div className="contacts-needcall">
        <h3 style={{ marginBottom: "10px", color: "#e36164" }}>
          {this.state.searchContacts.length} contact
          {this.state.searchContacts.length > 1 ? "s" : ""} attend
          {this.state.searchContacts.length > 1 ? "ent" : ""} nos appels
        </h3>
        <SearchBar handleSearch={this.search} type="contact" />
        <table>
          <thead>
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">Dernier Appel</th>
              {/* <th scope="col">Time</th> */}
              <th scope="col">Fréquence d'appel</th>
            </tr>
          </thead>
          <tbody>
            {randomOrder.map((contact) => (
              <tr key={contact._id}>
                <td scope="row" data-label="Nom">
                  <Link to={`/contacts/${contact._id}/`}>{contact.name}</Link>
                </td>
                <td data-label="Dernier Appel">
                  <Link to={`/contacts/${contact._id}/`}>
                    {contact.lastcall
                      ? this.formatDate(contact.lastcall)
                      : "Aucun appel"}
                  </Link>
                </td>
                {/* <td scope="row" data-label="Nom">
                  <Link to={`/contacts/${contact._id}/`}>{contact.time}</Link>
                </td> */}
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

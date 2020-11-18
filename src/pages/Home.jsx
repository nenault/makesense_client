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
    // mycontacts: [],
    contacts: [],
  };

  componentDidMount() {
    apiHandler
      .getAll("/api/contacts")
      .then((apiRes) => {
        this.setState({ contacts: apiRes.data });
        this.isCallNeeded();
        // if (this.context.user.contacts.length > 0) {
        //   apiHandler
        //     .getOne("/api/users/", this.context.user._id)
        //     .then((apiRes) => {
        //       // console.log("fdsfds");
        //       // this.setState({ mycontacts: apiRes.data.contacts });
        //       this.getContacts(apiRes.data.contacts);
        //     })
        //     .catch((error) => {
        //       console.log(error);
        //     });
        // }
      })
      .catch((apiErr) => {
        console.log(apiErr);
      });
  }

  // getContacts = (data) => {
  //   const contactsArr = [];
  //   for (const [index, item] of data.entries()) {
  //     // console.log(item.contact);
  //     apiHandler
  //       .getOne("/api/contacts/", item.contact)
  //       .then((apiRes) => {
  //         // console.log(apiRes.data);
  //         contactsArr.push(apiRes.data);
  //         this.setState({ mycontacts: contactsArr });
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // };

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
  }

  formatDate(date) {
    const getDate = date.split("T")[0].split("-");
    const formatedDate = `${getDate[2]}-${getDate[1]}-${getDate[0]}`;
    // return `${date[2]}-${date[1]}-${date[0]}`;
    return formatedDate;
  }

  render() {
    const contactsToCall = [];

    for (const [index, item] of this.state.contacts.entries()) {
      if (item.needcall === true) {
        contactsToCall.push(item);
      }
    }
    // if (!this.context.user) {
    //   return <div>Loading</div>;
    // }
    return (
      <div>
        {this.context.user && this.context.user.contacts.length > 0 ? (
          <Mycontacts />
        ) : (
          ""
        )}

        <NeedCallContacts />
        <NeedWriteContacts />
      </div>
    );
  }
}

export default Home;
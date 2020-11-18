import React from "react";
import ActiveContacts from "./ActiveContacts";
import InactiveContacts from "./InactiveContacts";
import { Link } from "react-router-dom";

function Contacts() {
  return (
    <>
      <Link to={"/contacts/create"}>Create</Link>
      <div className="contacts-admin">
        <ActiveContacts />
        <InactiveContacts />
      </div>
    </>
  );
}

export default Contacts;

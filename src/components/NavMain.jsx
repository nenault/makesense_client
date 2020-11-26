import React from "react";
import { NavLink } from "react-router-dom";
import { withUser } from "../components/Auth/withUser";
import apiHandler from "../api/apiHandler";

import "../styles/NavMain.css";

const NavMain = (props) => {
  const { context } = props;

  function handleLogout() {
    apiHandler
      .logout()
      .then(() => {
        context.removeUser();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <nav className="NavMain">
      <NavLink exact to="/">
        <img
          className="logo-nav"
          src="https://res.cloudinary.com/ddwcgukvk/image/upload/v1606295343/websitearecurso-19_b9ra6h.png"
          alt="logo"
        />
      </NavLink>
      <ul className="nav-list">
        {context.isMob && (
          <React.Fragment>
            <li>
              <NavLink to="/contacts">
                <h4 style={{ color: "#196c84" }}>Contacts</h4>
              </NavLink>
            </li>
            <li>
              <NavLink to="/users">
                <h4 style={{ color: "#196c84" }}>Bénévoles</h4>
              </NavLink>
            </li>
            <li>
              <NavLink to="/institutions">
                <h4 style={{ color: "#196c84" }}>Etablissements</h4>
              </NavLink>
            </li>
          </React.Fragment>
        )}
        {context.isLoggedIn && (
          <React.Fragment>
            {/* <li>
              <NavLink to="/profile">
                {context.user && context.user.email.split("@")[0]}
              </NavLink>
            </li> */}
            <li>
            <h4 style={{ color: "#e36164" }} onClick={handleLogout}>Me déconnecter</h4>
            </li>
          </React.Fragment>
        )}
        {/* {!context.isLoggedIn && (
          <React.Fragment>
            <li>
              <NavLink to="/signin">Log in</NavLink>
            </li>
            <li>
              <NavLink to="/signup">Create account</NavLink>
            </li>
          </React.Fragment>
        )} */}
      </ul>
    </nav>
  );
};

export default withUser(NavMain);

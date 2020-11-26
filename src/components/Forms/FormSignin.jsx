import React, { Component } from "react";

import { UserContext } from "../Auth/UserContext";
import { withRouter } from "react-router-dom";
import apiHandler from "../../api/apiHandler";
import { Link } from "react-router-dom";

class FormSignin extends Component {
  static contextType = UserContext;

  state = {
    email: "",
    password: "",
  };

  handleChange = (event) => {
    const key = event.target.name;

    // You can test more if you have to handle different sorts of inputs.
    const value =
      event.target.type === "file"
        ? event.target.files[0]
        : event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    this.setState({ [key]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    apiHandler
      .signin(this.state)
      .then((data) => {
        this.context.setUser(data);
        this.props.history.push("/");
      })
      .catch((error) => {
        console.log(error);
        // Display error message here, if you set the state
      });
  };

  render() {
    return (
      <div className="container">
        <form
          className="form"
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        >
          <img className="logo-form"
            src="https://s3-eu-west-1.amazonaws.com/makesense.org/uploads/20200827171359/vRecurso-16-8.png"
            alt="logo_reaction"
          />
          <label className="label" htmlFor="email">Email</label>
          <input className="input" type="email" id="email" name="email" />
          <label className="label" htmlFor="password">Mot de passe</label>
          <input
            className="input"
            type="password"
            id="password"
            name="password"
          />
          <button
            style={{
              marginTop: "50px",
            }}
            className="btn red"
          >
            Je me connecte
          </button>
          <Link to={"/signup"} className="register">
            Ou je m'inscris
          </Link>
        </form>
      </div>
    );
  }
}

export default withRouter(FormSignin);

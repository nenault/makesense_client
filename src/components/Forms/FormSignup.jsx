import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { UserContext } from "../Auth/UserContext";
import apiHandler from "../../api/apiHandler";
import { Link } from "react-router-dom";

class FormSignup extends Component {
  static contextType = UserContext;

  state = {
    email: "",
    password: "",
    status: "",
  };

  handleChange = (event) => {
    const value =
      event.target.type === "file"
        ? event.target.files[0]
        : event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    const key = event.target.name;

    this.setState({ [key]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    apiHandler
      .signup(this.state)
      .then((data) => {
        this.context.setUser(data);
        this.props.history.push("/");
      })
      .catch((error) => {
        console.log(error);
        this.setState({ status: "Cet email est déjà utilisé ou n'est pas autorisé" });
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
          <img
            className="logo-form"
            src="https://s3-eu-west-1.amazonaws.com/makesense.org/uploads/20200827171359/vRecurso-16-8.png"
            alt="logo_reaction"
          />
          <label className="label" htmlFor="email">
            Email
          </label>
          <input className="input" type="email" id="email" name="email" />
          <span
            style={{
              fontWeight: "bold",
              color:"#e36164"
            }}
          >
            {this.state.status}
          </span>
          <label className="label" htmlFor="password">
            Mot de passe
          </label>
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
            Je m'inscris
          </button>
          <Link to={"/signin"} className="register">
            Ou je me connecte
          </Link>
        </form>
      </div>
    );
  }
}

export default withRouter(FormSignup);

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
            style={{
              width: "30vw",
              marginBottom: "50px",
            }}
            src="https://s3-eu-west-1.amazonaws.com/makesense.org/uploads/20200827171359/vRecurso-16-8.png"
            alt="logo_reaction"
          />
          <label htmlFor="email">Mon email</label>
          <input className="input" type="email" id="email" name="email" />
          <label htmlFor="password">Mon mot de passe</label>
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

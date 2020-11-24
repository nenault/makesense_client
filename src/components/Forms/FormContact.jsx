import React, { Component } from "react";
import apiHandler from "../../api/apiHandler";
import { UserContext } from "../Auth/UserContext";
import { withRouter } from "react-router-dom";

class FormContact extends Component {
  static contextType = UserContext;

  state = {
    name: "",
    contact: "",
    comment: "",
    frequency: "",
    type: "",
    creator: "",
    institution_code: "",
  };

  componentDidMount() {
    if (this.props.action === "edit") {
      apiHandler
        .getOne("/api/contacts/", this.props.id)
        .then((apiRes) => {
          const contact = apiRes.data;
          this.setState({
            name: contact.name,
            contact: contact.contact,
            comment: contact.comment,
            type: contact.type,
            frequency: contact.frequency,
            institution_code: contact.institution_code,
          });
        })
        .catch((apiErr) => {
          console.log(apiErr);
        });
    }
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({ [name]: value, creator: this.context.user._id });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.props.action === "edit") {
      this.updateItem();
    } else {
      this.createItem();
    }
  };

  createItem() {
    apiHandler
      .createOne("/api/contacts", this.state)
      .then((apiRes) => {
        this.props.history.push("/contacts");
      })
      .catch((apiError) => {
        console.log(apiError);
      });
  }

  updateItem = () => {
    apiHandler
      .updateOne("/api/contacts/" + this.props.id, this.state)
      .then((apiRes) => {
        this.props.history.push("/contacts");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <div className="ItemForm-container">
          <form className="form" onSubmit={this.handleSubmit}>
            <h2 className="title">Ajouter un contact</h2>

            <div className="form-group">
              <label className="label" htmlFor="name">
                Prénom / Nom
              </label>
              <input
                id="name"
                className="input"
                type="text"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="contact">
                Numéro ou mail
              </label>
              <input
                id="contact"
                className="input"
                type="text"
                name="contact"
                value={this.state.contact}
                onChange={this.handleChange}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="comment">
                Commentaires
              </label>
              <input
                id="comment"
                className="input"
                type="text"
                name="comment"
                value={this.state.comment}
                onChange={this.handleChange}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="institution_code">
                Code de l'établissement
              </label>
              <input
                id="institution_code"
                className="input"
                type="text"
                name="institution_code"
                value={this.state.institution_code}
                onChange={this.handleChange}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="type">
                Contacter par
              </label>

              <select
                id="type"
                value={this.state.type}
                name="type"
                onChange={this.handleChange}
              >
                <option value="appel">Téléphone</option>
                <option value="eMail">Email</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="frequency">
                Contacter tous les
              </label>

              <select
                id="frequency"
                value={this.state.frequency}
                name="frequency"
                onChange={this.handleChange}
              >
                <option value="-1" disabled>
                  Select a frequency
                </option>
                <option value="Chaque jour">Chaque jour</option>
                <option value="1 fois par semaine">1 fois par semaine</option>
                <option value="2 fois par semaine">2 fois par semaine</option>
                <option value="email : pas de limitation">
                  email : pas de limitation
                </option>
                <option value="Ne souhaite plus être appelé">
                  Ne souhaite plus être appelé
                </option>
              </select>
            </div>

            <button className="btn red">Ajouter</button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(FormContact);

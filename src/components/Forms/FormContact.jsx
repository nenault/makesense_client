import React, { Component } from "react";
import apiHandler from "../../api/apiHandler";
import { UserContext } from "../Auth/UserContext";
import { withRouter } from "react-router-dom";

class FormContact extends Component {
  static contextType = UserContext;

  state = {
    name: "",
    comment: "",
    frequency: "",
    creator: "",
  };

  componentDidMount() {
    if (this.props.action === "edit") {
      apiHandler
        .getOne("/api/contacts/", this.props.id)
        .then((apiRes) => {
          const contact = apiRes.data;
          this.setState({
            name: contact.name,
            comment: contact.comment,
            frequency: contact.frequency,
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
            <h2 className="title">Add Contact</h2>

            <div className="form-group">
              <label className="label" htmlFor="name">
                Name
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
              <label className="label" htmlFor="comment">
                Comment
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
              <label className="label" htmlFor="frequency">
                Frequency
              </label>

              <select
                id="frequency"
                value={
                  this.props.action === "edit"
                    ? this.state.frequency
                    : "-1"
                }
                name="frequency"
                onChange={this.handleChange}
              >
                <option value="-1" disabled>
                  Select a frequency
                </option>
                <option value="Chaque jour">Chaque jour</option>
                <option value="1 fois par semaine">1 fois par semaine</option>
                <option value="2 fois par semaine">2 fois par semaine</option>
                <option value="email : pas de limitation">email : pas de limitation</option>
                <option value="Ne souhaite plus être appelé">Ne souhaite plus être appelé</option>
              </select>
            </div>

            <button>Add contact</button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(FormContact);

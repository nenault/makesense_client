import React, { Component } from "react";
import apiHandler from "../../api/apiHandler";
import { withRouter } from "react-router-dom";

class FormVolunteer extends Component {
  state = {
    nom: "",
    prenom: "",
    email: "",
    status: "",
  };

  componentDidMount() {
    if (this.props.action === "edit") {
      apiHandler
        .getOne("/api/volunteers/", this.props.id)
        .then((apiRes) => {
          const volunteer = apiRes.data;
          this.setState({
            nom: volunteer.nom,
            prenom: volunteer.prenom,
            email: volunteer.email,
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

    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.props.action === "edit") {
      this.updateVolunteer();
    } else {
      this.createVolunteer();
    }
  };

  createVolunteer() {
    apiHandler
      .createOne("/api/volunteers", this.state)
      .then((apiRes) => {
        // console.log(apiRes);
        this.props.history.push("/users");
      })
      .catch((apiError) => {
        console.log(apiError);
        this.setState({ status: "Ce bénévole existe déjà" });
      });
  }

  updateVolunteer = () => {
    apiHandler
      .updateOne("/api/volunteers/" + this.props.id, this.state)
      .then((apiRes) => {
        this.props.history.push("/users");
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
            <h2 className="title">
              {this.props.action === "edit" ? "Modifier" : "Ajouter"} un
              bénévole
            </h2>

            <div className="form-groups">
              <div className="form-group">
                <label className="label" htmlFor="prenom">
                  Prénom :&nbsp;
                </label>
                <input
                  id="prenom"
                  className="input"
                  type="text"
                  name="prenom"
                  value={this.state.prenom}
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label className="label" htmlFor="nom">
                  Nom :&nbsp;
                </label>

                <input
                  id="nom"
                  className="input"
                  type="text"
                  name="nom"
                  value={this.state.nom}
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label className="label" htmlFor="email">
                  Email :&nbsp;
                </label>
                <input
                  id="email"
                  className="input"
                  type="text"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </div>
              <span
                style={{
                  fontWeight: "bold",
                  color: "#e36164",
                }}
              >
                {this.state.status}
              </span>
            </div>

            <button style={{ marginTop: "40px" }} className="btn red">
              {this.props.action === "edit" ? "Modifier" : "Ajouter"}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(FormVolunteer);

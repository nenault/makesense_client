import React, { Component } from "react";
import apiHandler from "../../api/apiHandler";
import { withRouter } from "react-router-dom";

class FormInstitution extends Component {
  state = {
    code: "",
    type: "",
    name: "",
    groupe: "",
    postal_code: "",
    city: "",
    departement: "",
  };

  componentDidMount() {
    if (this.props.action === "edit") {
      apiHandler
        .getOne("/api/institutions/", this.props.id)
        .then((apiRes) => {
          const institution = apiRes.data;
          this.setState({
            code: institution.code,
            type: institution.type,
            name: institution.name,
            groupe: institution.groupe,
            postal_code: institution.postal_code,
            city: institution.city,
            departement: institution.departement,
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
      this.updateInstitution();
    } else {
      this.createInstitution();
    }
  };

  createInstitution() {
    apiHandler
      .createOne("/api/institutions", this.state)
      .then((apiRes) => {
        this.props.history.push("/institutions");
      })
      .catch((apiError) => {
        console.log(apiError);
      });
  }

  updateInstitution = () => {
    apiHandler
      .updateOne("/api/institutions/" + this.props.id, this.state)
      .then((apiRes) => {
        this.props.history.push("/institutions");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const depList = [
      "Ain",
      "Aisne",
      "Allier",
      "Alpes-de-Haute-Provence",
      "Hautes-Alpes",
      "Alpes-Maritimes",
      "Ardèche",
      "Ardennes",
      "Ariège",
      "Aube",
      "Aude",
      "Aveyron",
      "Bouches-du-Rhône",
      "Calvados",
      "Cantal",
      "Charente",
      "Charente-Maritime",
      "Cher",
      "Corrèze",
      "Corse",
      "Côte-d'Or",
      "Côtes-d'Armor",
      "Creuse",
      "Dordogne",
      "Gironde",
      "Doubs",
      "Drôme",
      "Eure",
      "Eure-et-Loir",
      "Finistère",
      "Gard",
      "Haute-Garonne",
      "Gers",
      "Hérault",
      "Ille-et-Vilaine",
      "Indre",
      "Indre-et-Loire",
      "Isère",
      "Jura",
      "Landes",
      "Loir-et-Cher",
      "Loire",
      "Haute-Loire",
      "Loire-Atlantique",
      "Loiret",
      "Lot",
      "Lot-et-Garonne",
      "Lozère",
      "Maine-et-Loire",
      "Manche",
      "Marne",
      "Haute-Marne",
      "Mayenne",
      "Meurthe-et-Moselle",
      "Meuse",
      "Morbihan",
      "Moselle",
      "Nièvre",
      "Nord",
      "Oise",
      "Orne",
      "Pas-de-Calais",
      "Puy-de-Dôme",
      "Pyrénées-Atlantiques",
      "Hautes-Pyrénées",
      "Pyrénées-Orientales",
      "Bas-Rhin",
      "Haut-Rhin",
      "Rhône",
      "Haute-Saône",
      "Saône-et-Loire",
      "Sarthe",
      "Savoie",
      "Haute-Savoie",
      "Paris",
      "Seine-Maritime",
      "Seine-et-Marne",
      "Yvelines",
      "Deux-Sèvres",
      "Somme",
      "Tarn",
      "Tarn-et-Garonne",
      "Var",
      "Vaucluse",
      "Vendée",
      "Vienne",
      "Haute-Vienne",
      "Vosges",
      "Yonne",
      "Territoire de Belfort",
      "Essonne",
      "Hauts-de-Seine",
      "Seine-St-Denis",
      "Val-de-Marne",
      "Val-D'Oise",
      "Guadeloupe",
      "Martinique",
      "Guyane",
      "La Réunion",
    ];

    return (
      <div>
        <div className="ItemForm-container">
          <form className="form" onSubmit={this.handleSubmit}>
            <h2 className="title">Ajouter un établissement</h2>

            <div className="form-group">
              <label className="label" htmlFor="code">
                Code établissement
              </label>
              <input
                id="code"
                className="input"
                type="text"
                name="code"
                value={this.state.code}
                onChange={this.handleChange}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="type">
                Type d'établissement
              </label>

              <select
                id="type"
                value={this.state.type}
                name="type"
                onChange={this.handleChange}
              >
                <option value="EHPAD">EHPAD</option>
                <option value="Résidence">Résidence</option>
                <option value="SAD">SAD</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="name">
                Nom de l'établissement
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
              <label className="label" htmlFor="groupe">
                Groupe
              </label>
              <input
                id="groupe"
                className="input"
                type="text"
                name="groupe"
                value={this.state.groupe}
                onChange={this.handleChange}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="postal_code">
                Code postal
              </label>
              <input
                id="postal_code"
                className="input"
                type="text"
                name="postal_code"
                value={this.state.postal_code}
                onChange={this.handleChange}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="city">
                Ville
              </label>
              <input
                id="city"
                className="input"
                type="text"
                name="city"
                value={this.state.city}
                onChange={this.handleChange}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="departement">
                Département
              </label>

              <select
                id="departement"
                value={this.state.departement}
                // String(this.state.departement[0])
                name="departement"
                onChange={this.handleChange}
              >
                {depList.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn red">Ajouter</button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(FormInstitution);

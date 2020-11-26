import React, { Component } from "react";
import apiHandler from "../../api/apiHandler";
import { Link } from "react-router-dom";
import SearchBar from "../../components/Forms/SearchBar";

class Institutions extends Component {
  state = {
    institutions: [],
    searchInstitutions: [],
    departement: "Ain",
  };

  componentDidMount() {
    apiHandler
      .getAll("/api/institutions")
      .then((apiRes) => {
        this.setState({
          institutions: apiRes.data,
          searchInstitutions: apiRes.data,
        });
      })
      .catch((apiErr) => {
        console.log(apiErr);
      });
  }

  deleteOne(id) {
    apiHandler
      .deleteOne("/api/institutions/", id)
      .then((apiRes) => this.componentDidMount())
      .catch((apiErr) => console.log(apiErr));
  }

  handleChange = (event) => {
    // const name = event.target.name;
    const value = event.target.value;

    this.setState({
      departement: value,
    });
  };

  search = (searchInstitution) => {
    const copyInstitutions = [...this.state.institutions];

    const filteredInstitutions = copyInstitutions.filter((institution) =>
      institution.name
        .toLowerCase()
        .includes(searchInstitution.search.toLowerCase())
    );
    this.setState({ searchInstitutions: filteredInstitutions });
  };

  render() {
    if (!this.state.institutions) {
      return <div>Loading</div>;
    }

    const filteredDep = this.state.searchInstitutions.filter(
      (institution) => institution.departement === this.state.departement
    );
    // const depList  = [...new Set(array)];

    // const depArr = [];
    // for (const [index, item] of this.state.institutions.entries()) {
    //   depArr.push(item.departement);
    // }

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
      <div className="page institutions">
        <h1>Les établissements</h1>
        <Link
          style={{ marginBottom: "40px" }}
          className="btn red"
          to={"/institutions/create"}
        >
          Ajouter un établissement
        </Link>
        <div style={{ marginBottom: "20px" }}>
          <label className="label" htmlFor="departement">
            Département :&nbsp;
          </label>

          <select
            id="departement"
            defautvalue={"Ain"}
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
        <SearchBar handleSearch={this.search} type="établissement"/>
        <table>
          <thead>
            <tr>
              <th scope="col">Code établissement</th>
              <th scope="col">Type</th>
              <th scope="col">Nom</th>
              <th scope="col">Groupe</th>
              <th scope="col">CP</th>
              <th scope="col">Ville</th>
              <th scope="col">Département</th>
              <th scope="col">Editer</th>
              <th scope="col">Supprimer</th>
            </tr>
          </thead>
          <tbody>
            {filteredDep.map((institution) => (
              <tr key={institution._id}>
                <td scope="row" data-label="Code">
                  {institution.code}
                </td>
                <td data-label="Type">{institution.type}</td>
                <td data-label="Nom">{institution.name}</td>
                <td data-label="Groupe">{institution.groupe}</td>
                <td data-label="Code postale">{institution.postal_code}</td>
                <td data-label="Ville">{institution.city}</td>
                <td data-label="Département">{institution.departement}</td>
                <td data-label="Editer">
                  <Link to={`/institutions/${institution._id}/edit`}>
                    <i className="fas fa-edit"></i>
                  </Link>
                </td>
                <td data-label="Supprimer">
                  <Link
                    to={this.props}
                    onClick={() => this.deleteOne(institution._id)}
                  >
                    <i className="fas fa-backspace"></i>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Institutions;

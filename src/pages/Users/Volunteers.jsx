import React, { Component } from "react";
import apiHandler from "../../api/apiHandler";
import { Link } from "react-router-dom";
import SearchBar from "../../components/Forms/SearchBar";

class Volunteers extends Component {
  state = {
    volunteers: [],
    searchVolunteers: [],
  };

  componentDidMount() {
    apiHandler
      .getAll("/api/volunteers")
      .then((apiRes) => {
        this.setState({
          volunteers: apiRes.data,
          searchVolunteers: apiRes.data,
        });
      })
      .catch((apiErr) => {
        console.log(apiErr);
      });
  }

  deleteOne(id) {
    apiHandler
      .deleteOne("/api/volunteers/", id)
      .then((apiRes) => this.componentDidMount())
      .catch((apiErr) => console.log(apiErr));
  }

  search = (searchVolunteers) => {
    const copyVolunteers = [...this.state.volunteers];
    const filteredVolunteers = copyVolunteers.filter((volunteer) =>
      volunteer.email
        .toLowerCase()
        .includes(searchVolunteers.search.toLowerCase())
    );
    this.setState({ searchVolunteers: filteredVolunteers });
  };

  render() {
    // const mobs = [];
    // const volunteers = [];

    // for (const [index, item] of this.state.searchUsers.entries()) {
    //   if (item.isMob === true) {
    //     mobs.push(item);
    //   } else {
    //     volunteers.push(item);
    //   }
    // }

    return (
      <div className="">
        <div className="users-mobs">
        <h3 style={{ marginBottom: "10px", color: "#e36164" }}>
              {this.state.searchVolunteers.length} participant·e
              {this.state.searchVolunteers.length > 1 ? "·s" : ""} non inscrit·e{this.state.searchVolunteers.length > 1 ? "·s" : ""}
            </h3>
          <SearchBar handleSearch={this.search} type="bénévole" />
          <table>
            <thead>
              <tr>
                <th scope="col">Email<br />&nbsp;</th>
                <th scope="col">Supprimer<br />&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {this.state.searchVolunteers.map((volunteer) => (
                <tr key={volunteer._id}>
                  <td scope="row" data-label="Email">
                    {volunteer.email}
                  </td>
                  <td data-label="Supprimer">
                    <Link
                      to={this.props}
                      onClick={() => this.deleteOne(volunteer._id)}
                    >
                      <i className="fas fa-backspace"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Volunteers;

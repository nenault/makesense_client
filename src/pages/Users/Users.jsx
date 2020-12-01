import React, { Component } from "react";
import apiHandler from "../../api/apiHandler";
import { Link } from "react-router-dom";
import SearchBar from "../../components/Forms/SearchBar";
import Volunteers from "./Volunteers";

class Users extends Component {
  state = {
    users: [],
    searchUsers: [],
  };

  componentDidMount() {
    apiHandler
      .getAll("/api/users")
      .then((apiRes) => {
        this.setState({ users: apiRes.data, searchUsers: apiRes.data });
      })
      .catch((apiErr) => {
        console.log(apiErr);
      });
  }

  deleteOne(id) {
    apiHandler
      .deleteOne("/api/users/", id)
      .then((apiRes) => this.componentDidMount())
      .catch((apiErr) => console.log(apiErr));
  }

  upgrade(id) {
    apiHandler
      .updateOne("/api/users/" + id, { isMob: true })
      .then((apiRes) => this.componentDidMount())
      .catch((apiErr) => console.log(apiErr));
  }

  downgrade(id) {
    apiHandler
      .updateOne("/api/users/" + id, { isMob: false })
      .then((apiRes) => this.componentDidMount())
      .catch((apiErr) => console.log(apiErr));
  }

  formatDate(date) {
    const getDate = date.split("T")[0].split("-");
    const formatedDate = `${getDate[2]}-${getDate[1]}-${getDate[0]}`;
    // return `${date[2]}-${date[1]}-${date[0]}`;
    return formatedDate;
  }

  search = (searchUser) => {
    const copyUsers = [...this.state.users];
    const filteredUsers = copyUsers.filter((user) =>
      user.email.toLowerCase().includes(searchUser.search.toLowerCase())
    );
    this.setState({ searchUsers: filteredUsers });
  };

  render() {
    const mobs = [];
    const volunteers = [];

    for (const [index, item] of this.state.searchUsers.entries()) {
      if (item.isMob === true) {
        mobs.push(item);
      } else {
        volunteers.push(item);
      }
    }

    return (
      <div className="page">
        <h1>Les bénévoles</h1>
        <Link
          style={{ marginBottom: "40px" }}
          className="btn red"
          to={"/volunteers/create"}
        >
          Ajouter un bénévole
        </Link>
        <div className="users-list">
          <div className="users-mobs">
            <h3 style={{ marginBottom: "10px", color: "#e36164" }}>
              {mobs.length} mob{mobs.length > 1 ? "s" : ""}
            </h3>
            <SearchBar handleSearch={this.search} type="bénévole" />
            <table>
              <thead>
                <tr>
                  <th scope="col">Email</th>
                  <th scope="col">Membre depuis</th>
                  <th scope="col">Retirer mob</th>
                  <th scope="col">Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {mobs.map((user) => (
                  <tr key={user._id}>
                    <td scope="row" data-label="Email">{user.email}</td>
                    <td data-label="Depuis">{this.formatDate(user.created)}</td>
                    <td data-label="Retirer mob">
                      <Link
                        to={this.props}
                        onClick={() => this.downgrade(user._id)}
                      >
                        <i className="fas fa-user-times"></i>
                      </Link>
                    </td>
                    <td data-label="Supprimer">
                      <Link
                        to={this.props}
                        onClick={() => this.deleteOne(user._id)}
                      >
                        <i className="fas fa-backspace"></i>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="users-volunteers">
            <h3 style={{ marginBottom: "10px", color: "#e36164" }}>
              {volunteers.length} participant·e
              {volunteers.length > 1 ? "·s" : ""} inscrit·e{volunteers.length > 1 ? "·s" : ""}
            </h3>
            <SearchBar handleSearch={this.search} type="bénévole" />
            <table>
              <thead>
                <tr>
                  <th scope="col">Email</th>
                  <th scope="col">Membre depuis</th>
                  <th scope="col">Nommer mob</th>
                  <th scope="col">Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((user) => (
                  <tr key={user._id}>
                    <td scope="row" data-label="Email">{user.email}</td>
                    <td data-label="Depuis">{this.formatDate(user.created)}</td>
                    <td data-label="Nommer mob">
                      <Link
                        to={this.props}
                        onClick={() => this.upgrade(user._id)}
                      >
                        <i className="fas fa-user-plus"></i>
                      </Link>
                    </td>
                    <td data-label="Supprimer">
                      <Link
                        to={this.props}
                        onClick={() => this.deleteOne(user._id)}
                      >
                        <i className="fas fa-backspace"></i>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Volunteers />
        </div>
      </div>
    );
  }
}

export default Users;

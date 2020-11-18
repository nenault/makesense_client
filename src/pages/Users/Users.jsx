import React, { Component } from "react";
import apiHandler from "../../api/apiHandler";
import { Link } from "react-router-dom";

class Users extends Component {
  state = {
    users: [],
  };

  componentDidMount() {
    apiHandler
      .getAll("/api/users")
      .then((apiRes) => {
        this.setState({ users: apiRes.data });
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
      .updateOne("/api/users/" + id, {isMob : true})
      .then((apiRes) => this.componentDidMount())
      .catch((apiErr) => console.log(apiErr));
  }

  downgrade(id) {
    apiHandler
      .updateOne("/api/users/" + id, {isMob : false})
      .then((apiRes) => this.componentDidMount())
      .catch((apiErr) => console.log(apiErr));
  }

  formatDate(date) {
    const getDate = date.split("T")[0].split("-");
    const formatedDate = `${getDate[2]}-${getDate[1]}-${getDate[0]}`;
    // return `${date[2]}-${date[1]}-${date[0]}`;
    return formatedDate;
  }


  render() {
    const mobs = [];
    const volunteers = [];

    for (const [index, item] of this.state.users.entries()) {
      if (item.isMob === true) {
        mobs.push(item);
      } else {
        volunteers.push(item);
      }
    }

    return (
      <div>
        <h2>Mobs</h2>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Membre depuis</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mobs.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{this.formatDate(user.created)}</td>
                <td>
                  <Link
                    to={this.props}
                    onClick={() => this.downgrade(user._id)}
                  >
                    Retirer mob
                  </Link>
                </td>
                <td>
                  <Link
                    to={this.props}
                    onClick={() => this.deleteOne(user._id)}
                  >
                    Supprimer
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Bénévoles</h2>
        <table>
          <thead>
            <tr>
            <th>Email</th>
              <th>Membre depuis</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{this.formatDate(user.created)}</td>
                <td>
                  <Link to={this.props} onClick={() => this.upgrade(user._id)}>
                    Devenir mob
                  </Link>
                </td>
                <td>
                  <Link
                    to={this.props}
                    onClick={() => this.deleteOne(user._id)}
                  >
                    Supprimer
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

export default Users;

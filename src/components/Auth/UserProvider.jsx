import React, { Component } from "react";
import apiHandler from "../../api/apiHandler";
import { UserContext } from "./UserContext";

class UserProvider extends Component {
  state = {
    user: null,
    isLoggedIn: false,
    isLoading: true,
    isMob: false,
  };

  componentDidMount() {
    apiHandler
      .isLoggedIn()
      .then((data) => {
        this.setState({ user: data, isLoggedIn: true, isLoading: false, isMob : data.isMob });
      })
      .catch((error) => {
        this.setState({ user: null, isLoggedIn: false, isLoading: false, isMob : false });
      });
  }

  setUser = (user) => {
    this.setState({ user, isLoggedIn: true, isMob : user.isMob });
  };

  removeUser = () => {
    this.setState({ user: null, isLoggedIn: false, isMob : false });
  };

  render() {
    //  Setup all the values/functions you want to expose to anybody reading
    // from the AuthContext.
    const authValues = {
      user: this.state.user,
      setUser: this.setUser,
      removeUser: this.removeUser,
      isLoggedIn: this.state.isLoggedIn,
      isLoading: this.state.isLoading,
      isMob: this.state.isMob,
    };

    return (
      <UserContext.Provider value={authValues}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default UserProvider;

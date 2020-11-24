import React, { Component } from "react";

export default class SearchBar extends Component {
  state = {
    search: "",
  };

  handleChange = (event) => {
    const value = event.target.value;

    this.setState({
      search: value,
    });

    this.props.handleSearch({
      search: event.target.value,
    });
  };

  render() {
    return (
      <div className="search-bar">
        <form className="Form">
          <input
            id="search"
            autoComplete="off"
            className="search"
            type="text"
            name="search"
            placeholder="Chercher un contact..."
            value={this.state.search}
            onChange={this.handleChange}
          />
        </form>
      </div>
    );
  }
}

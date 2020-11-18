import React, { Component } from "react";
import apiHandler from "../../api/apiHandler";
import { UserContext } from "../Auth/UserContext";

class FormCall extends Component {
  static contextType = UserContext;

  state = {
    comment: "",
    last: "",
    contact: this.props.contact,
    creator: "",
    creatorId: "",
  };

  componentDidMount() {
    if (this.props.action === "edit") {
      apiHandler
        .getOne("/api/calls/", this.props.id)
        .then((apiRes) => {
          const call = apiRes.data;
          this.setState({
            comment: call.comment,
            last: call.last,
            creator: call.creator,
            creatorId: call.creatorId,
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

    this.setState({ [name]: value, creator: this.context.user.email, creatorId: this.context.user._id });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.props.action === "edit") {
      this.updateCall();
    } else {
      this.createCall();
    }
  };

  createCall() {
    apiHandler
      .createOne("/api/calls", this.state)
      .then((apiRes) => {
        // this.props.history.push("/");
        this.props.handleCall(apiRes.data);
      })
      .catch((apiError) => {
        console.log(apiError);
      });
  }

  updateCall = () => {
    apiHandler
      .updateOne("/api/calls/" + this.props.id, this.state)
      .then((apiRes) => {
        this.props.handleCall(apiRes.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <div className="ItemForm-container">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="comment">
                comment
              </label>
              <input
                id="comment"
                type="text"
                name="comment"
                value={this.state.comment}
                onChange={this.handleChange}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="last">
                last
              </label>
              <input
                id="last"
                type="text"
                name="last"
                value={this.state.last}
                onChange={this.handleChange}
              />
            </div>

            <button>Add call</button>
          </form>
        </div>
      </div>
    );
  }
}

export default FormCall;

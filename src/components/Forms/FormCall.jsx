import React, { Component } from "react";
import apiHandler from "../../api/apiHandler";
import { UserContext } from "../Auth/UserContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
registerLocale("fr", fr);

class FormCall extends Component {
  static contextType = UserContext;

  state = {
    comment: "",
    last: "",
    contact: this.props.contact,
    creator: "",
    creatorId: "",
    empty: false,
    created: "",
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
            empty: call.empty,
            creator: call.creator,
            creatorId: call.creatorId,
            created: new Date(call.created),
          });
        })
        .catch((apiErr) => {
          console.log(apiErr);
        });
    }

    this.setState({
      created: new Date(),
    });
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      [name]: value,
      creator: this.context.user.email,
      creatorId: this.context.user._id,
    });
  };

  handleChangeCheckbox = () => {
    this.setState({
      empty: !this.state.empty,
      creator: this.context.user.email,
      creatorId: this.context.user._id,
    });
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
        // console.log(apiRes);
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

  getDate = (date) => {
    //  console.log(date);
    return (
      date.getFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2)
    );
  };

  handleDate = (event) => {
    this.setState({
      created: event,
    });
  };

  render() {
    //  console.log(this.state.created);
    return (
      <div>
        <div className="ItemForm-container">
          <form onSubmit={this.handleSubmit}>
            {/* this.props.action === "edit" */}

            <div>
              <label className="label" htmlFor="created">
                Date de l'appel
              </label>
              <br />
              {/* <input data-date-format="DD MMMM YYYY"
                style={{ padding: "8px", marginRight: "10px" }}
                id="created"
                type="date"
                name="created"
                value={
                  this.props.action === "edit"
                    ? this.getDate(this.state.created)
                    : this.getDate(new Date())
                }
                onChange={this.handleChange}
              /> */}
              <DatePicker
                locale="fr"
                closeOnScroll={true}
                selected={this.state.created}
                onChange={this.handleDate}
                dateFormat="dd/MM/yyyy"
              />
            </div>

            <div>
              <label className="label" htmlFor="comment">
                Compte rendu de l'appel
              </label>
              <br />
              <textarea
                className="compte-rendu"
                id="comment"
                type="text"
                name="comment"
                rows="8"
                value={this.state.comment}
                onChange={this.handleChange}
              />
            </div>

            <div className="call-details">
              <div>
                <label className="label" htmlFor="last">
                  Durée de l'appel
                </label>
                <br />
                <input
                  style={{ padding: "8px", marginRight: "10px" }}
                  id="last"
                  type="text"
                  name="last"
                  value={this.state.last}
                  onChange={this.handleChange}
                />
              </div>

              <div className="call-empty">
                <input
                  style={{ padding: "8px" }}
                  id="empty"
                  type="checkbox"
                  name="empty"
                  value={this.state.empty}
                  onChange={this.handleChangeCheckbox}
                />
                <label
                  style={{ marginLeft: "4px" }}
                  className="label"
                  htmlFor="empty"
                >
                  Le contact n'a pas répondu
                </label>
              </div>
            </div>

            <button className="btn small" style={{ marginTop: "10px" }}>
              Valider
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default FormCall;

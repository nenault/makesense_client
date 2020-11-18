import React, { Component } from "react";
import apiHandler from "../../api/apiHandler";
import CreateCall from "../Calls/CreateCall";
import EditCall from "../Calls/EditCall";
import { withRouter } from "react-router-dom";
import { UserContext } from "../../components/Auth/UserContext";

class OneContact extends Component {
  static contextType = UserContext;

  state = {
    contact: null,
    addCall: "",
    calls: [],
    isCall: "",
    lastcall: "",
    volunteers: [],
    add: "",
    histo: [],
  };

  componentDidMount() {
    apiHandler
      .getOne("/api/contacts/", this.props.match.params.id)
      .then((apiRes) => {
        this.setState({ contact: apiRes.data });
        this.buildCalls(apiRes.data.calls);

        if (apiRes.data.histo.length > 0) this.formatHisto(apiRes.data.histo);
        if (apiRes.data.volunteers.length > 0)
          this.getVolunteer(apiRes.data.volunteers);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  buildCalls = (data) => {
    for (const [index, item] of data.entries()) {
      apiHandler
        .getOne("/api/calls/", item.call)
        .then((apiRes) => {
          const copyCalls = [...this.state.calls];
          copyCalls.unshift(apiRes.data);

          this.setState({ calls: copyCalls });
          apiHandler
            .getOne("/api/calls/", item.call)
            .then((apiRes) => {})
            .catch((apiErr) => {
              console.log(apiErr);
            });
        })
        .catch((apiErr) => {
          console.log(apiErr);
        });
    }
  };

  addCallid = (call) => {
    this.setState({ lastcall: Date.now() });

    apiHandler
      .updateOne("/api/contacts/" + this.props.match.params.id, {
        needcall: false,
        lastcall: this.state.lastcall,
        $push: { calls: { call: call.call._id } },
      })
      .then((apiRes) =>
        apiHandler
          .getOne("/api/contacts/", this.props.match.params.id)
          .then((apiRes) => {
            this.setState({ addCall: "", calls: [], contact: apiRes.data });
            this.buildCalls(apiRes.data.calls);
          })
          .catch((error) => {
            console.log(error);
          })
      )

      .catch((apiErr) => console.log(apiErr));
  };

  updateCallId = (call) => {
    this.setState({ calls: "", addCall: "" });

    apiHandler
      .getOne("/api/contacts/", this.props.match.params.id)
      .then((apiRes) => {
        this.buildCalls(apiRes.data.calls);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addCall = (event) => {
    this.setState({
      addCall: (
        <CreateCall
          handleCall={this.addCallid}
          contact={this.props.match.params.id}
        />
      ),
    });
  };

  updateCall = (id) => {
    this.setState({
      addCall: (
        <EditCall
          id={id}
          handleCall={this.updateCallId}
          contact={this.props.match.params.id}
        />
      ),
    });
  };

  addVolunteer = (event) => {
    apiHandler
      .updateOne("/api/contacts/" + this.props.match.params.id, {
        $push: { volunteers: { volunteer: this.context.user._id } },
      })
      .then((apiRes) =>
        apiHandler
          .updateOne("/api/users/" + this.context.user._id, {
            $push: { contacts: { contact: this.props.match.params.id } },
          })
          .then((apiRes) => {
            apiHandler
              .getOne("/api/contacts/", this.props.match.params.id)
              .then((apiRes) => {
                // console.log(apiRes);
                this.setState({ contact: apiRes.data });
                this.getVolunteer(apiRes.data.volunteers);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          })
      )

      .catch((apiErr) => console.log(apiErr));
    // this.setState({ [name]: value, creator: this.context.user._id });
  };

  getVolunteer = (data) => {
    const volunteersArr = [];
    this.setState({ volunteers: [] });
    for (const [index, item] of data.entries()) {
      apiHandler
        .getOne("/api/users/", item.volunteer)
        .then((apiRes) => {
          // console.log(apiRes.data.email);
          volunteersArr.push(apiRes.data.email);
          this.setState({ volunteers: volunteersArr });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  removeVolunteer = (event) => {
    apiHandler
      .updateOne("/api/contacts/" + this.props.match.params.id, {
        $pull: { volunteers: { volunteer: this.context.user._id } },
      })
      .then((apiRes) => {
        this.setState({ contact: apiRes.data });
        this.getVolunteer(apiRes.data.volunteers);
        apiHandler
          .updateOne("/api/users/" + this.context.user._id, {
            $pull: { contacts: { contact: this.props.match.params.id } },
          })
          .then((apiRes) => {})

          .catch((apiErr) => console.log(apiErr));
      })

      .catch((apiErr) => console.log(apiErr));
  };

  formatDate(date) {
    const getDate = date.split("T")[0].split("-");
    const formatedDate = `${getDate[2]}/${getDate[1]}/${getDate[0]}`;
    // return `${date[2]}-${date[1]}-${date[0]}`;
    return formatedDate;
  }

  formatHisto(histo) {
    const histArr = [];

    for (const i of histo.split("***")) {
      // console.log(i.split("["));
      // i.replace("/","DDDDD")
      histArr.unshift(i);
    }
    this.setState({ histo: histArr });
  }

  render() {
    if (!this.state.contact) {
      return <div>Loading</div>;
    }
    return (
      <div className="container">
        <div className="contact">
          <div className="contact-info">
            <h2>{this.state.contact.name}</h2>
            <p>{this.state.contact.comment}</p>
            <p>Contact : {this.state.contact.contact}</p>
            <p>
              {this.state.contact.frequency} et {this.state.contact.type}
            </p>
            <p>
              Dernier call{" "}
              {this.state.contact.lastcall
                ? this.formatDate(this.state.contact.lastcall)
                : ""}
            </p>

            <ul>
              <h3>Bénévoles</h3>
              <li>
                {this.state.contact.volunteer_1
                  ? this.state.contact.volunteer_1
                  : ""}
              </li>
              <li>
                {this.state.contact.volunteer_2
                  ? this.state.contact.volunteer_2
                  : ""}
              </li>
              {this.state.volunteers.map((volunteer) => (
                <li key={volunteer}>{volunteer.split("@")[0]}</li>
              ))}
            </ul>
            {this.state.volunteers.includes(this.context.user.email) ? (
              <span onClick={() => this.removeVolunteer()}>
                Ne plus être bénévole
              </span>
            ) : (
              <span onClick={() => this.addVolunteer()}>Devenir bénévole</span>
            )}
            <span onClick={() => this.addCall()}> Ajouter un appel</span>
            <div>{this.state.addCall}</div>
          </div>
          <div className="contact-histo">
            <h3>Historique</h3>
            {this.state.calls &&
              this.state.calls.map((call) => (
                <div key={call._id}>
                  <div>{this.formatDate(call.created)}</div>
                  <div>{call.creator.split("@")[0]}</div>
                  <div>{call.comment}</div>
                  <div>{call.last}</div>
                  {call.creator === this.context.user.email ||
                  this.context.user.isMob === true ? (
                    <span onClick={() => this.updateCall(call._id)}>
                      Modifier cet appel
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            {this.state.histo.map((histo) => (
              <div key={histo}>
                <div className="histo-box">{histo}</div>
                <br />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(OneContact);

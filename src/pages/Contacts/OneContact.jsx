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
    time: "all",
    isActive: "",
    histo: [],
    institution: {},
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    apiHandler
      .getOne("/api/contacts/", this.props.match.params.id)
      .then((apiRes) => {
        this.setState({ contact: apiRes.data, isActive: apiRes.data.isActive });
        this.getTime(apiRes.data);
        this.buildCalls(apiRes.data.calls);
        if (apiRes.data.institution)
          this.buildInstitution(apiRes.data.institution);
        if (apiRes.data.histo) this.formatHisto(apiRes.data.histo);
        if (apiRes.data.volunteers) this.getVolunteer(apiRes.data.volunteers);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getTime = (data) => {
    if (data.time) {
      this.setState({ time: data.time });
    }
  };

  buildInstitution = (data) => {
    apiHandler
      .getOne("/api/institutions/", data)
      .then((apiRes) => {
        this.setState({ institution: apiRes.data });
      })
      .catch((apiErr) => {
        console.log(apiErr);
      });
  };

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
    if (call.call.empty === false) {
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
    } else {
      apiHandler
        .updateOne("/api/contacts/" + this.props.match.params.id, {
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
    }
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

  handleRadio = (event) => {
    this.setState(
      {
        time: event.target.value,
      },
      () =>
        apiHandler
          .updateOne("/api/contacts/" + this.props.match.params.id, {
            time: this.state.time,
          })
          .then((apiRes) => {
            // console.log(apiRes);
          })
          .catch((error) => {
            console.log(error);
          })
    );
  };

  contact = (event) => {
    this.setState(
      {
        isActive: !this.state.isActive,
      },
      () =>
        apiHandler
          .updateOne("/api/contacts/" + this.props.match.params.id, {
            isActive: this.state.isActive,
          })
          .then((apiRes) => {})

          .catch((apiErr) => console.log(apiErr))
    );
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
    // console.log(date);
    const getDate = date.split("T")[0].split("-");
    const formatedDate = `${getDate[2]}/${getDate[1]}/${getDate[0]}`;
    // return `${date[2]}-${date[1]}-${date[0]}`;
    return formatedDate;
  }

  formatHisto(histo) {
    const histArr = [];
    for (const i of histo.split("***")) {
      histArr.unshift([i.split("[")]);
    }
    this.setState({ histo: histArr });
  }

  deleteCall(id) {
    apiHandler
      .deleteOne("/api/calls/", id)
      .then((apiRes) => this.componentDidMount())
      .catch((apiErr) => console.log(apiErr));
  }

  render() {
    if (!this.state.contact) {
      return (
        <div className="loader">
          <i className="fas fa-spinner"></i>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="contact">
          <div className="contact-info">
            <div className="contact-bio">
              <h2>{this.state.contact.name}</h2>
              <h3>
                <i className="fas fa-phone"></i> /{" "}
                <i className="fas fa-envelope"></i> :{" "}
                {this.state.contact.contact}
              </h3>
              <div className="contact-institution">
                <p>{this.state.institution.name}</p>
                <p>
                  {this.state.institution.postal_code}&nbsp;
                  {this.state.institution.city}{" "}
                  {this.state.institution.departement}
                </p>
              </div>
              <div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={this.state.isActive === true}
                    onChange={this.contact}
                  />
                  <span
                    onClick={() => this.contact}
                    className="slider round"
                  ></span>
                </label>
                {this.state.isActive === true
                  ? "Cette personne souhaite être contactée"
                  : "Cette personne ne souhaite plus être contactée"}
              </div>
            </div>
            <div className="contact-details">
              <h4>Fréquence de contact : {this.state.contact.frequency}</h4>
              {this.state.contact.comment ? (
                <p>{this.state.contact.comment}</p>
              ) : (
                ""
              )}
              <div className="radio-list">
                Le meilleur moment pour appeler :
                <div>
                  {" "}
                  <input
                    checked={this.state.time === "morning"}
                    id="morning"
                    type="radio"
                    name="details"
                    value="morning"
                    onChange={this.handleRadio}
                  />
                  <label className="radio-item" htmlFor="morning">
                    Le matin
                  </label>
                </div>
                <div>
                  <input
                    checked={this.state.time === "afternoon"}
                    id="afternoon"
                    type="radio"
                    name="details"
                    value="afternoon"
                    onChange={this.handleRadio}
                  />
                  <label className="radio-item" htmlFor="afternoon">
                    L'après-midi
                  </label>
                </div>
                <div>
                  <input
                    checked={this.state.time === "all"}
                    id="all"
                    type="radio"
                    name="details"
                    value="all"
                    onChange={this.handleRadio}
                  />
                  <label className="radio-item" htmlFor="all">
                    A toute heure
                  </label>
                </div>
              </div>
              <ul tyle={{ marginTop: "40px" }}>
                {this.state.contact.volunteer_1 ||
                this.state.contact.volunteer_2 ||
                this.state.volunteers.length > 0 ? (
                  <h4 style={{ marginTop: "10px" }}>Bénévole(s)</h4>
                ) : (
                  <p style={{ marginTop: "10px" }}>
                    Il n'y a aucun·e bénévole en contact régulier avec{" "}
                    {this.state.contact.name}
                  </p>
                )}
                <li>
                  {this.state.contact.volunteer_1 ? (
                    <>
                      {" "}
                      <i
                        style={{ marginRight: "8px" }}
                        className="fas fa-user"
                      ></i>
                      {this.state.contact.volunteer_1}
                    </>
                  ) : (
                    ""
                  )}
                </li>
                <li>
                  {this.state.contact.volunteer_2 ? (
                    <>
                      {" "}
                      <i
                        style={{ marginRight: "8px" }}
                        className="fas fa-user"
                      ></i>
                      {this.state.contact.volunteer_2}
                    </>
                  ) : (
                    ""
                  )}
                </li>
                {this.state.volunteers.map((volunteer) => (
                  <li key={volunteer}>
                    <i
                      style={{ marginRight: "8px" }}
                      className="fas fa-user"
                    ></i>{" "}
                    {volunteer.split("@")[0]}{" "}
                    {volunteer === this.context.user.email ? (
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => this.removeVolunteer()}
                      >
                        (me désabonner)
                      </span>
                    ) : (
                      ""
                    )}
                  </li>
                ))}
              </ul>
              {this.state.volunteers.includes(this.context.user.email) ? (
                ""
              ) : (
                <span
                  style={{ marginTop: "10px" }}
                  className="btn small"
                  onClick={() => this.addVolunteer()}
                >
                  Devenir un contact régulier
                </span>
              )}
            </div>
          </div>
          <div className="contact-histo">
            <h3 className="date-call" style={{ marginBottom: "10px" }}>
              Dernier contact :{" "}
              {this.state.contact.lastcall
                ? this.formatDate(this.state.contact.lastcall)
                : "aucun contact n'a encore eu lieu"}
            </h3>
            <span className="btn red" onClick={() => this.addCall()}>
              {" "}
              Ajouter un appel
            </span>

            <div>{this.state.addCall}</div>
            <h3 style={{ marginTop: "10px" }}>Historique des appels</h3>
            <div className="histo-lists">
              {this.state.calls &&
                this.state.calls.map((call) => (
                  <div style={{ marginBottom: "20px" }} key={call._id}>
                    <h4>
                      {this.formatDate(call.created)}{" "}
                      {call.empty === true ? "(pas de réponse)" : ""}
                    </h4>
                    <div>Bénévole : {call.creator.split("@")[0]}</div>
                    {call.empty === true ? (
                      ""
                    ) : (
                      <>
                        <div>Durée : {call.last}</div>
                        <div>Commentaire : {call.comment}</div>
                      </>
                    )}

                    <div>
                      {" "}
                      {call.creator === this.context.user.email ||
                      this.context.user.isMob === true ? (
                        <>
                          <span
                            style={{ cursor: "pointer", marginRight: "6px" }}
                            onClick={() => this.updateCall(call._id)}
                          >
                            Editer <i className="far fa-edit"></i>
                          </span>
                          {/* <span
                            style={{ cursor: "pointer" }}
                            onClick={() => this.deleteCall(call._id)}
                          >
                            Supprimer <i className="fas fa-backspace"></i>
                          </span> */}
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ))}
              {this.state.histo.map((onecall) => (
                <div className="histo-box" key={onecall}>
                  {onecall.map((calldetail) => (
                    <div key={calldetail}>
                      <h4>{calldetail[0]}</h4>
                      <p>{calldetail[1]}</p>
                      <p>{calldetail[2]}</p>
                      <p>{calldetail[3]}</p>
                      <p>{calldetail[4]}</p>
                      <p>{calldetail[5]}</p>
                    </div>
                  ))}
                  <br />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(OneContact);

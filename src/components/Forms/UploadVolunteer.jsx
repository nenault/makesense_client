import React, { Component } from "react";
import { CSVReader } from "react-papaparse";
import apiHandler from "../../api/apiHandler";
import { withRouter } from "react-router-dom";

const buttonRef = React.createRef();

class UploadVolunteer extends Component {
  state = {
    volunteers: [],
    error: null,
    validate: "",
    count: 0,
    already: 0,
    counter: "",
  };

  handleOpenDialog = (e) => {
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  handleOnFileLoad = (data) => {
    // console.log(data);
    const dataArray = [];
    for (const [index, item] of data.entries()) {
      if (item.data.length > 1) {
        dataArray.push(item);
      }
    }

    this.setState({
      counter: "",
      count: 0,
      volunteers: dataArray,
      validate: (
        <button
          style={{
            marginTop: 40,
            marginLeft: 10,
          }}
          className="btn"
          type="button"
          onClick={this.handleValidate}
        >
          Valider cette liste
        </button>
      ),
    });
  };

  handleOnError = (err, file, inputElem, reason) => {
    this.setState({
      error:
        "Oups, une erreur s'est produite lors du chargement du fichier, merci de réessayer :)",
    });
  };

  handleValidate = (e) => {
    // let count = 0
    for (const [index, item] of this.state.volunteers.entries()) {
      apiHandler
        .createOne("/api/volunteers", {
          prenom: item.data[1],
          nom: item.data[2],
          email: item.data[3],
        })
        .then((apiRes) => {
          //   this.props.history.push("/users");
          this.setState(
            {
              count: this.state.count + 1,
            },
            () =>
              this.setState({
                counter: (
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#e36164",
                      marginLeft: 10,
                    }}
                  >
                    {this.state.count} bénévole
                    {this.state.count === 1 ? "" : "s"}{" "}
                    {this.state.count === 1
                      ? "a été ajouté"
                      : "ont été ajoutés"}
                  </span>
                ),
              })
          );
          //   console.log(apiRes);
        })
        .catch((apiError) => {
          console.log(apiError);
          this.setState(
            {
              //   count: this.state.count - 1,
              already: this.state.already + 1,
            },
            () =>
              this.setState({
                counter: (
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#e36164",
                      marginLeft: 10,
                    }}
                  >
                    Ces bénévoles sont déjà enregistrés
                  </span>
                ),
              })
          );
        });
      // console.log(item);
    }
  };

  render() {
    //   console.log(this.state.volunteers);
    const header = this.state.volunteers.shift();
    const volunteers = this.state.volunteers;

    // console.log(this.state.count);
    return (
      <div className="page">
        <h1>Ajouter une liste de bénévoles</h1>
        <CSVReader
          ref={buttonRef}
          onFileLoad={this.handleOnFileLoad}
          onError={this.handleOnError}
          noClick
          noDrag
        >
          {({ file }) => (
            <aside
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: 10,
                alignItems: "flex-end",
              }}
            >
              <button
                style={{
                  marginTop: 40,
                }}
                className="btn red"
                type="button"
                onClick={this.handleOpenDialog}
              >
                Charger un fichier CSV
              </button>

              {/* {this.state.volunteers.length > 0 && (
                <button
                  className="btn"
                  type="button"
                  onClick={this.handleValidate}
                >
                  Valider cette liste
                </button>
              )} */}
              {this.state.validate}
              {this.state.counter}
            </aside>
          )}
        </CSVReader>

        {this.state.volunteers.length > 0 && (
          <table>
            <thead>
              <tr>
                {header.data.map((head) => (
                  <th key={head}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => (
                <tr key={volunteer.data[3]}>
                  {volunteer.data.map((data) => (
                    <td key={data}>{data}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {this.state.error && this.state.error}
      </div>
    );
  }
}

export default withRouter(UploadVolunteer);

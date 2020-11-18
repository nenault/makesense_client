import React, { Component } from "react";
import FormCall from "../../components/Forms/FormCall";

class EditCall extends Component {
  addCall = (call) => {
    this.props.handleCall({
      call: call,
    });
  };

  render() {
    return (
      <div>
        <FormCall
          action="edit"
          id={this.props.id}
          handleCall={this.addCall}
          contact={this.props.contact}
        />
      </div>
    );
  }
}

export default EditCall;

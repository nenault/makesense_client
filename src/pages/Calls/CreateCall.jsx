import React, { Component } from "react";
import FormCall from "../../components/Forms/FormCall";

class CreateCall extends Component {
  addCall = (call) => {
    this.props.handleCall({
      call: call,
    });
  };

  render() {
    return (
      <div className="create-call">
        <FormCall handleCall={this.addCall} contact={this.props.contact} />
      </div>
    );
  }
}

export default CreateCall;
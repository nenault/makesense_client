import React from "react";
import FormInstitution from "../../components/Forms/FormInstitution";

function EditInstitution(props) {
  return (
    <div>
      <FormInstitution action="edit" id={props.match.params.id} />
    </div>
  );
}

export default EditInstitution;

import React from 'react'
import FormContact from "../../components/Forms/FormContact";


const EditContact = (props) => {
    return (
        <div>
             <FormContact action="edit" id={props.match.params.id} />
        </div>
  );
};

export default EditContact

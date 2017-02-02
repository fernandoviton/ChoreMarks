import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';

class AddPerson extends Component {
    render() {
        return (
            <div className="AddPerson">
              <p>
                <input type="text" id="personID" name="personName" /> <br/>
                <Button bsStyle="primary" name="personBtn" className="personButton" onClick={() => alert("not implemented") }>
                Add New Person
                </Button>
              </p>
            </div>
        );
    }
}


export default AddPerson;
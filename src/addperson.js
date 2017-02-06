import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';

class AddPerson extends Component {
  render() {
      return (
          <div className="AddPerson">
            <p>
              <input type="text" id="personID2" name="personName" /> <br/>
              <Button bsStyle="primary" name="personBtn" className="personButton" onClick={() => this.AddNewPerson() }>
              Add New Person
              </Button>
            </p>
          </div>
      );
  }
  
  AddNewPerson() {

    var inputElement = document.getElementById('personID2');
    if (inputElement != null) {
      var personName = inputElement.value;
      if (personName === "") {
        alert('Please enter the name of the new person');
      }
      else {
        var listOfPeople = this.props.listOfPeople;
        listOfPeople.push({fullName: personName});
      }
    }
  }

}


export default AddPerson;
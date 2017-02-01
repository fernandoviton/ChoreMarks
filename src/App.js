import React, { Component } from 'react';
import logo from './logo.svg';
import familyImg from './family.png';
import './App.css';
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

/*

class ChoreMark extends Component {
  constructor() {
    super();
    this.state = {
      numberOfChores: 1
    }
  }

  
  render() {
    //alert('about to render the chore mark: ' + this.props.value);
    return (
      <p className="choreMark">
        New from the Chore Marks class: {this.props.value} 
      </p>
    );
  }

  getNumber() {
    return this.state.numberOfChores;
  }

}
*/

class ChoreEntry {
  constructor(num, sum) {
    this.state = {
      myDate: Date.now(),
      myNumber: num,
      mySum: sum
    }
  }
  renderChoreEntry() {
    return (<p className="choreMark">
        Today: {this.state.myNumber} Total: {this.state.mySum} 
    </p>);
  }

  getSum() { return this.state.mySum; }
}

class ChoreList extends Component {

  constructor() {
    super();
    this.state = {
      history: [{
        choreEntry: new ChoreEntry(2, 2)
      }], 
    }
  }

  addChore(numMarks) {
    const history = this.state.history;
    const current = history[history.length-1];
    const newChore = new ChoreEntry(numMarks, numMarks + current.choreEntry.getSum());
    this.setState({
      history: history.concat([{
        choreEntry: newChore
      }]),
    });
  }

  renderChoreMarks() {
    const history = this.state.history;
    const current = history[history.length-1];
    return current.choreEntry.renderChoreEntry();
  }

  render() {
    //alert('render function for ChoreList');
    return (
      <div className="App">
        <button className="ChoreMarkButton" onClick={() => this.addChore(5)}>
          Add Chore for {this.props.value}
        </button>
        <div className="ShowChores">
          {this.renderChoreMarks()}
        </div>
      </div>
    );
  }


}

class ChoreNavBar extends Component {
  render() {
    return (
      <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#">Check off Chores</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <NavItem eventKey={1} href="#">Link</NavItem>
      <NavItem eventKey={2} href="#">Link</NavItem>
      <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
        <MenuItem eventKey={3.1}>Action</MenuItem>
        <MenuItem eventKey={3.2}>Another action</MenuItem>
        <MenuItem eventKey={3.3}>Something else here</MenuItem>
        <MenuItem divider />
        <MenuItem eventKey={3.3}>Separated link</MenuItem>
      </NavDropdown>
    </Nav>
  </Navbar>
    );

  }
} 


class App extends Component {

  constructor() {
    super();
    this.state = {
      listOfPeople: [{fullName: "First Person"}], //chorelistItem: new ChoreList()}],
      EnriqueChoreMark: 1000,
      dtnum: new ChoreEntry(22, 22), 
      EnriqueToday: 0,
      EnriqueBeforeToday: 50,
      NatalieToday: 0,
      NatalieBeforeToday: 50,
    }
  }


  AddNewPerson() {
    var inputElement = document.getElementById('personID');
    if (inputElement != null) {
      var personName = inputElement.value;
      if (personName === "") {
        alert('Please enter the name of the new person');
      }
      else {
        const listOfPeople = this.state.listOfPeople;
        this.setState({
          listOfPeople: listOfPeople.concat([{
            fullName: personName
          }]),
        });
      }
    }
  }

  renderNavBar() {

  }

//          <input type="submit" className="Family-Button" src={familyImg}> </input>

  render() {
    return (
      <div className="App">

        <ChoreNavBar/>

        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          Check off Chores
          <button type="submit">
            <img src={familyImg} className="Family-Button" alt="Add Person"/>
          </button>
        </div>


        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>



        <div className="AddPerson">
        <p>
          <input type="text" id="personID" name="personName" /> <br/>
          <button name="personBtn" className="personButton" onClick={() => this.AddNewPerson() }>
          Add New Person
          </button>
        </p>
        </div>


        {this.state.listOfPeople.map(
          function(person, index) {
            return <ChoreList value={person.fullName} key={index}> </ChoreList>;
            //return <button key={index}> {name} Button </button>;
          })
        }

      </div>
    );
  }
}

export default App;

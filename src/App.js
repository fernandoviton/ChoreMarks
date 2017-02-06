import React, { Component } from 'react';
import { Router, Route, hashHistory } from 'react-router';
//import logo from './logo.svg';
//import familyImg from './family.png';
import './App.css';
import Button from 'react-bootstrap/lib/Button';
import ChoreNavBar from './ChoreNavBar';
import AddPerson from './addperson';
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
        <Button bsStyle="primary" className="ChoreMarkButton" onClick={() => this.addChore(5)}>
          Add Chore for {this.props.value}
        </Button>
        <div className="ShowChores">
          {this.renderChoreMarks()}
        </div>
      </div>
    );
  }


}


class App extends Component {
  
  constructor() {
    super();
    this.state = {
      comment: "this is my comment",
      listOfPeople: [{fullName: "First Person"}], //chorelistItem: new ChoreList()}],
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

  renderAddNewPerson() {
    return (
            <div className="AddPerson">
          <p>
            <input type="text" id="personIDOLD" name="personName" /> <br/>
            <Button bsStyle="primary" name="personBtn" className="personButton" onClick={() => this.AddNewPerson() }>
            Add New Person
            </Button>
          </p>
        </div>
    );

  }

  renderAddPersonPage() {
    return (
      <div className="AddPerson">
          <p>
            <input type="text" id="personID" name="personName" /> <br/>
            <Button bsStyle="primary" name="personBtn" className="personButton" onClick={() => this.AddNewPerson() }>
            Add New Person OH YEA
            </Button>
          </p>
        </div>
    );
  }

  renderListOfPeoplePage() {
    var listOfPeople = this.state.listOfPeople;
    if (listOfPeople == null) {
      return null;
    }
    return (
      <div className="Home">
        {listOfPeople.map(
          function(person, index) {
            return <ChoreList value={person.fullName} key={index}> </ChoreList>;
            //return <button key={index}> {name} Button </button>;
          })
        }
      </div>
    );
  }



  renderRouter() {

    const Container = (props) => <div>
        <ChoreNavBar />
        {props.children}
      </div>

    return (
        <div>
      <Router history={hashHistory}>
      <Route component={Container}>
        <Route path='/' component={() => this.renderListOfPeoplePage()} />
        <Route path='/home' component={() => this.renderListOfPeoplePage()} />
        <Route path='/addPerson' component={() => this.renderAddPersonPage()} />
      </Route>
      </Router>
      </div>
      );
  }


  render() {
    return (<div className="App"> {this.renderRouter()} </div>);
  }
}


export default App;

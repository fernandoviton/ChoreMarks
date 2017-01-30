import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


class ChoreMark extends Component {
  constructor() {
    super();
    this.state = {
      numberOfChores: 1
    }
  }

  /*incrementChore() {
    //alert('increment');
    this.setState({
      numberOfChores: 8,
    }); 
    alert('increment: ' + this.state.numberOfChores);
  }*/
  
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

  ENRIQUE() { return 1; }
  NATALIE() { return 2; }

  increaseChoreMarks(i) {
    if (i == this.ENRIQUE()) {
      //this.state.EnriqueChoreMark.incrementChore();
      /*var updateEnrique = this.state.EnriqueChoreMark.slice();
      updateEnrique.setNumber(.number() + 1);
      alert('about to update:' + updateEnrique.number());*/
      this.setState({
        dtnum: new ChoreEntry(this.state.dtnum.getValue()+1),
        EnriqueChoreMark: this.state.EnriqueChoreMark + 1,
        EnriqueToday: this.state.EnriqueToday + 1,
      });
    }
    else if (i == this.NATALIE()) {
      this.setState({
        NatalieToday: this.state.NatalieToday + 1
      });
    }
  }

  AddNewPerson() {
    const listOfPeople = this.state.listOfPeople;
    const current = listOfPeople[listOfPeople.length-1];
    var inputElement = document.getElementById('personID');
    if (inputElement != null) {
      var personName = inputElement.value;
      if (personName == "") {
        alert('Please enter the name of the new person');
      }
      else {
        this.setState({
          listOfPeople: listOfPeople.concat([{
            fullName: personName
          }]),
        });
      }
    }
  }


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
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

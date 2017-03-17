import React, { Component } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import './App.css';
import ChoreNavBar from './ChoreNavBar';
import Members from './members';
import MemberDetails from './memberDetails';

class App extends Component {

  renderRouter() {

    const Container = (props) => <div>
        <ChoreNavBar />
        {props.children}
      </div>

    return (
        <div>
      <Router history={browserHistory}>
      <Route component={Container}>
        <Route path='/' component={Members} />
        <Route path='members' component={Members} />
        <Route path='details' component={MemberDetails} />
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

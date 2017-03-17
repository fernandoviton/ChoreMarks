import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Table from 'react-bootstrap/lib/Table';
import { browserHistory } from 'react-router';

class MemberDetails extends Component {
	constructor() {
		super();
		var name = "";
		var searchString = browserHistory.getCurrentLocation().search;
		for (var i=0; i<searchString.length; i++) {
			if (searchString[i] === '=') {
				name = searchString.substring(i+1, searchString.length);
				break;
			}
		}
		this.state = {
			name: name,
			chores: [],
		}
	}

	

	addChore() {
		var valueElement = document.getElementById('valueID');
		if (valueElement != null) {
			
			var value = valueElement.value;
			if (valueElement <= 0) {
				alert('Please enter a positive value for the number of chores');
			}
			
			var d = new Date();
			var date = d.toLocaleDateString();
			console.log(date); 
			
			var description = "";
			var descriptionElement = document.getElementById('descriptionID');
			if (descriptionElement != null) {
				description = descriptionElement.value;
			}
			
			var newChore = {date:date, value:value, description:description};
			var newChoreList = this.state.chores.slice();
			newChoreList.push(newChore);
			this.setState({
				chores: newChoreList
			});
		}
	}

	renderChores() {
		return <Table striped bordered condensed hover>
			<thead>
				<tr>
					<th>Date</th>
					<th>Value</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				{this.state.chores.map(function(chore, i) {
					return <tr key={i}>
						<td>{chore.date}</td>
						<td>{chore.value}</td>
						<td>{chore.description}</td>
					</tr>
				})}
			</tbody>
		</Table>
	}

	render() {
		console.log("in render");

		return <div className="MemberInfo">
				<h1>Chores for {this.state.name}</h1>
				Value: <input type="number" id="valueID" name="valueName" />
				Description: <input type="text" id="descriptionID" name="descriptionName" />
				<Button bsStyle="primary" className="AddChore" onClick={() => this.addChore()}>
					Edit
				</Button>
				{this.renderChores()}
			</div>;
	}
}

export default MemberDetails;
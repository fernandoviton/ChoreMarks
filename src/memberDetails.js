import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Table from 'react-bootstrap/lib/Table';
import { browserHistory } from 'react-router';
import { ChoreDetailsDataAccess } from './dataMembers'

class MemberDetails extends Component {
	constructor() {
		super();
		var paramValue = "";
		var memberGuid = null;
		var searchString = browserHistory.getCurrentLocation().search;
		var paramName = "";
		for (var i=1; i<searchString.length; i++) {
			if (searchString[i] === '=') {
				paramValue = searchString.substring(i+1, searchString.length);
				if (paramName === 'memberGuid') {
					memberGuid = paramValue;
					break;
				}
				else {
					for (var j=i; j<searchString.length; j++) {
						if (searchString[j] === '&') {
							i = j;
							break;
						}
					}
					paramValue = "";
					paramName = "";
				}
			} else if (searchString[i] !== '&') {
				paramName += searchString[i];
			}
		}
		this.state = {
			memberGuid: memberGuid,
			memberName: "",
			chores: [],
			choresDataAccess: null
		}
	}

	componentDidMount() {
		var choreDataAccess = new ChoreDetailsDataAccess("ChoresTable3", this.state.memberGuid, this.dataAccessRefreshCallback.bind(this));
		this.setState({choresDataAccess: choreDataAccess});

		choreDataAccess.LoadSingleMember(this.state.memberGuid, function(memberName) {
			this.setState({memberName: memberName});
		}.bind(this));
	}

	dataAccessRefreshCallback() {
		this.GetAllChores();
	}



	GetAllChores() {
		var tableData = this.state.choresDataAccess.GetTableData();
		this.setState({
			chores: tableData,
		});
	}

	addChore() {
		console.log('in addChore');
		var valueElement = document.getElementById('valueID');
		if (valueElement == null) return;

		var value = valueElement.value;
		if (value <= 0) {
			alert('Please enter a positive value for the number of chores');
			return;
		}

		var d = new Date();
		console.log(d);
		var date = d.toLocaleDateString() + " " + d.toLocaleTimeString();
		console.log(date); 
		
		var description = "";
		var descriptionElement = document.getElementById('descriptionID');
		if (descriptionElement != null) {
			description = descriptionElement.value;
		}
		console.log("value=" + value + " description=" + description + " date=" + date);

		this.state.choresDataAccess.AddNewChore(this.state.memberGuid, date, value, description);
	}

/*
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
	*/

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

	CreateTable() {
		this.state.choresDataAccess.CreateChoresTable();
	}

	render() {
		console.log("in render");

		return <div className="MemberInfo">
				<h1>Chores for {this.state.memberName}</h1>
				<Button bsStyle="primary" onClick={() => this.CreateTable()}>CreateTable</Button> 
				Value: <input type="number" id="valueID" name="valueName" />
				Description: <input type="text" id="descriptionID" name="descriptionName" />
				<Button bsStyle="primary" className="AddChore" onClick={() => this.addChore()}>
					Add New Chore
				</Button>
				{this.renderChores()}
			</div>;
	}
}

export default MemberDetails;
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Table from 'react-bootstrap/lib/Table';
import { browserHistory } from 'react-router';


class Members extends Component {
	constructor() {
		super();
		this.state = {
			members: [],
			currentMember: -1
		}
	}

	AddMember() {
		var inputElement = document.getElementById('personID');
		if (inputElement != null) {
			var memberName = inputElement.value;
			if (memberName === "") {
				alert('Please enter the name of the new member');
			}
			else {
				var members = this.state.members.slice();
				var member = { name: memberName, unpaidChoreQueue: [] };
				members.push(member);
				this.setState({
					members: members,
					currentMember: members.length - 1
				});
			}
		}
	}

	renderMember() {
		return (this.state.members.map(function(member, i) {
				//alert('about to render');
					//memberInfo.push(member.name);
					console.log("name = " + member.name);
					return <tr key={i}>
							<td>{member.name}</td>
						</tr>
				}));
	}

	editMember(i) {
		console.log("edit YES i=" + i);
		var name = this.state.members[i].name;
		browserHistory.push('details?name=' + name);
	}

	renderMembers() {
		var memberInfo = [];
		memberInfo.push("Members");
		console.log("numMembers = " + this.state.members.length);
		return <Table striped bordered condensed hover>
			<thead>
				<tr>
					<th>Members</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{this.state.members.map(function(member, i) {
				//alert('about to render');
					//memberInfo.push(member.name);
					console.log("name = " + member.name);
					return <tr key={i}>
							<td>{member.name}</td>
							<td><Button bsStyle="primary" className="EditMember" onClick={() => this.editMember(i)}>
								Edit
								</Button>
							</td>
						</tr>
				}.bind(this))}
			</tbody>
		</Table>

	}

	render() {


		/*if (this.state.currentMember !== -1) {
			var i = this.state.currentMember;
			var member = this.state.members[i];
			memberInfo += member.name;
		}*/

		return <div className="Members"> 
            <div> <input type="text" id="personID" name="personName" /> 
			<Button bsStyle="primary" className="AddMemberButton" onClick={() => this.AddMember("Someone")}>
			Add Member
			</Button>
			</div>
			<h1>Members</h1>
			{this.renderMembers()}
		</div>;
	}
}

export default Members;
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Table from 'react-bootstrap/lib/Table';
import { browserHistory } from 'react-router';
import { MemberDataAccess } from './dataMembers';


class Members extends Component {
	constructor() {
		super();
		this.state = {
			members: [],
			currentMember: -1,
			memberDataAccess: null,
		}
	}

	componentDidMount() {
		this.setState({
			memberDataAccess: new MemberDataAccess("MemberTable3", this.dataAccessRefreshCallback.bind(this)),
		});
	}


	dataAccessRefreshCallback() {
		this.GetAllMembers();
	}

	AddMember() {
		var inputElement = document.getElementById('personID');
		if (inputElement == null) return;

		var memberName = inputElement.value;
		if (memberName === "") {
			alert('Please enter the name of the new member');
			return;
		}
		
		this.state.memberDataAccess.AddNewMember(memberName);
	}

	GetAllMembers() {
		//this.state.memberDataAccess.LoadTableData();
		var tableData = this.state.memberDataAccess.GetTableData();
		this.setState({
			members: tableData,
			currentMember: tableData.length - 1
		});
	}
/*
	AddMembertoInternalMemberMemberState() {
		var inputElement = document.getElementById('personID');
		if (inputElement != null) {
			var memberGuid = inputElement.value;
			if (memberGuid === "") {
				alert('Please enter the name of the new member');
			}
			else {
				var members = this.state.members.slice();
				var member = { idNumber: -20, memberGuid: memberName, displayName: memberName, inEditMode: false  };//, unpaidChoreQueue: [] };
				members.push(member);
				this.setState({
					members: members,
					currentMember: members.length - 1
				});
			}
		}
	}
*/
	choresPage(i) {
		var member = this.state.members[i];
		browserHistory.push('details?id='+member.idNumber+'&memberGuid='+member.memberGuid);
	}

	editMember(i, cancel) {

		var members = this.state.members.slice();
		console.log("edit YES i=" + i + " internaName=" + members[i].memberGuid );

		if (members[i].inEditMode && !cancel) {
			var inputElement = document.getElementById("memberName_"+ members[i].memberGuid);
			if (inputElement != null) {
				var newDisplayName = inputElement.value;
				if (newDisplayName === "" || newDisplayName === members[i].displayName) {
					alert('Please enter the new display name of the member');
					return;
				} else {
					this.state.memberDataAccess.UpdateMember(members[i].idNumber, members[i].memberGuid, newDisplayName);
				}
			}
		}
		members[i].inEditMode = !members[i].inEditMode;
		this.setState(members);
	}

	deleteMember(i) {
		var member = this.state.members[i];
		this.state.memberDataAccess.DeleteMember(member.idNumber, member.memberGuid);
	}

	renderMembers() {
		var memberInfo = [];
		memberInfo.push("Members");
		console.log("rending members: numMembers=" + this.state.members.length);
		return <Table striped bordered condensed hover>
			<thead>
				<tr>
					<th>Name</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{this.state.members.map(function(member, i) {
					console.log("   name = " + member.displayName);

					if (member.inEditMode) {
						return <tr key={i}>
							<td><input type="text" id={"memberName_"+member.memberGuid} defaultValue={member.displayName} /></td>
							<td>
								<Button bsStyle="link" onClick={() => this.editMember(i)}>Update</Button>
								<Button bsStyle="link" onClick={() => this.editMember(i, true)}>Cancel</Button>
								<Button bsStyle="link" onClick={() => this.deleteMember(i)}>Delete</Button>
							</td>
						</tr>

					} else {
						return <tr key={i}>
							<td>{member.displayName}</td>
							<td>
								<Button bsStyle="link" className="Chores" onClick={() => this.choresPage(i)}>Chores</Button>
								<Button bsStyle="link" className="Edit" onClick={() => this.editMember(i)}>Edit</Button>
								<Button bsStyle="link" className="Delete" onClick={() => this.deleteMember(i)}>Delete</Button>
							</td>
						</tr>
					}


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
			<Button bsStyle="primary" className="Create Members Table" onClick={() => this.state.memberDataAccess.CreateMemberTable()}>
			Create Member Table
			</Button>
			<Button bsStyle="primary" className="Get All Members" onClick={() => this.GetAllMembers()}>
			Refresh All Members
			</Button>
			</div>
			<h1>Members</h1>
			{this.renderMembers()}
		</div>;
	}
}

export default Members;
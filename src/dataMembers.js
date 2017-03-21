//import React, { Component } from 'react';
import AWS from 'aws-sdk';
import UUID from 'uuid/v1';

class DataAccessClass {

	constructor(tableName, dataAccessRefreshCallback) {
		this.dynamodb = null;
		this.docClient = null;
		this.tableName = tableName;
		this.tableData = null;
		this.componentCallback = dataAccessRefreshCallback;
	}

	getDocClient() {
		if (this.docClient) return this.docClient;

		var config = require('../.env/customconfig.json');
		AWS.config.update({
			region: config.dynamodb.region,
			endpoint: config.dynamodb.endpoint,
			accessKeyId: config.dynamodb.accessKeyId,
			secretAccessKey: config.dynamodb.secretAccessKey,
		});

		this.docClient = new AWS.DynamoDB.DocumentClient();
		return this.docClient;
	}

	getDynamoDB() {
		if (this.dynamodb) return this.dynamodb;

		var config = require('../.env/customconfig.json');
		AWS.config.update({
			region: config.dynamodb.region,
			endpoint: config.dynamodb.endpoint,
			accessKeyId: config.dynamodb.accessKeyId,
			secretAccessKey: config.dynamodb.secretAccessKey,
		});

		this.dynamodb = new AWS.DynamoDB();
		return this.dynamodb;
	}

	CreateTable(params) {
		var dynamodb = this.getDynamoDB();

		if (dynamodb == null) {
			console.log('no dynamodb');
			return;
		}

		console.log("about to create a table");
		dynamodb.createTable(params, function(err, data) {
			if (err) {
				console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
			} else {
				console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
			}
		});		
	}

	GetTableData() {
		return this.tableData;
	}

	UpdateRow(params) {
		var docClient = this.getDocClient();
		if (docClient == null) return;

		docClient.update(params, function(err, data) {
			if (err) {
				console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
			} else {
				console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
				this.LoadTableData();
			}
		}.bind(this));

	}

	extractRowInfo(row) {
		alert("Oh NO!!! Called Base Class extractRowInfo!!!");
		return null;
	}

	LoadTableData() {
		alert("Oh NO!!! Called Base Class LoadTableData!!!");
		return null;
	}

	LoadTableDataInternal(params) {
		var docClient = this.getDocClient();
		if (docClient == null) return;

		const onScan = (err, data) => {
			if (err) {
				alert('failed to load table: ' + this.tableName);
				console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
			} else {
				// get all the members
				this.tableData = new Array(data.Items.length);
				data.Items.map(function(row, index) {
					console.log(row);
					this.tableData[index] = this.extractRowInfo(row);
					return this.tableData[index];
				}.bind(this));

				if (this.componentCallback != null) {
					// Callback the calling class to let them know that the data is now available to render
					this.componentCallback();
				}
				else {
					console.log("callback is null");
				}

				// continue scanning if we have more members, because
				// scan can retrieve a maximum of 1MB of data
				if (typeof data.LastEvaluatedKey !== "undefined") {
					console.log("Scanning for more...");
					params.ExclusiveStartKey = data.LastEvaluatedKey;
					docClient.scan(params, onScan);
				}
			}
		}

		console.log("Scanning table (" + this.tableName + ")");
		docClient.scan(params, onScan);
	}

	AddRow(params) {
		var docClient = this.getDocClient();
		if (docClient == null) return;

		docClient.put(params, function (err, data) {
			if (err) console.log(err, err.stack);
			else {
				console.log("Added new Row: " + data);
				this.LoadTableData();
			}
		}.bind(this));
	}

	DeleteRow(params) {
		var docClient = this.getDocClient();
		if (docClient == null) return;

		docClient.delete(params, function(err, data) {
			if (err)
				console.error("unable to delete item");
			else {
				this.LoadTableData();
			}
		}.bind(this));
	}

}

export class MemberDataAccess extends DataAccessClass {

	constructor(tableName, dataAccessRefreshCallback) {
		super(tableName, dataAccessRefreshCallback);
		this.LoadTableData();
	}

	extractRowInfo(row) {
		var displayName = row.info.displayName; 
		if (typeof(displayName) === 'object') {
			displayName = displayName.S;
		}
		console.log("MemberGuid: " + row.memberGuid + " DisplayName:" + displayName);
				
		var tableRowData = {
			idNumber: row.ID,
			memberGuid: row.memberGuid,
			displayName: displayName
		};
		return tableRowData;
	}

	LoadTableData() {
		var params = {
			TableName: this.tableName,
			ProjectionExpression: "ID, memberGuid, info.displayName",
		};
		this.LoadTableDataInternal(params)
	}

	LoadSingleMemberFromGuid(memberGuid) {
		var params = {
			TableName: this.tableName,
			ProjectionExpression: "ID, memberGuid, info.displayName",
			FilterExpression: "memberGuid = :memberGuidValue",
			ExpressionAttributeValues: {
				":memberGuidValue": memberGuid
			}
		};
		console.log("retriving display name");
		this.LoadTableDataInternal(params);
	}

	CreateMemberTable() {
		var params = {
			TableName : this.tableName,
			KeySchema: [       
				{ AttributeName: "ID", KeyType: "HASH"},  //Partition key
				{ AttributeName: "memberGuid", KeyType: "RANGE" }  //Sort key
			],
			AttributeDefinitions: [       
				{ AttributeName: "ID", AttributeType: "N" },
				{ AttributeName: "memberGuid", AttributeType: "S" }
			],
			ProvisionedThroughput: {       
				ReadCapacityUnits: 10, 
				WriteCapacityUnits: 10
			}
		};
		this.CreateTable(params);

	}

	AddNewMember(fullName) {
		var guid = UUID(); 
		console.log("about to show Guid");
		console.log(guid);
		var params = {
			TableName: this.tableName,
			Item: {
				"ID": 1,
				"memberGuid": guid,
				"info": {
					"displayName": fullName
				}
			}
		};
		this.AddRow(params);
	}

	DeleteMember(IDNumber, memberGuid) {
		var params = {
			TableName: this.tableName,
			Key: {
				"ID": IDNumber,
				"memberGuid": memberGuid
			}
		};
		this.DeleteRow(params);
	}

	UpdateMember(idNumber, memberGuid, displayName) {
		var params = {
			TableName: this.tableName,
			Key: {
				"ID": idNumber,
				"memberGuid": memberGuid
			},
			UpdateExpression: "set info.displayName=:displayNameValue",
			ExpressionAttributeValues: {
				":displayNameValue": displayName
			}
		}
		this.UpdateRow(params);
	}
}

export class ChoreDetailsDataAccess extends DataAccessClass {

	constructor(tableName, memberGuid, dataAccessRefreshCallback) {
		super(tableName, dataAccessRefreshCallback);
		this.memberGuid = memberGuid;
		this.memberName = null;
		this.LoadTableData();
	}

	extractRowInfo(row) {
		console.log("row = " + row);
		var choreValue = row.info.choreValue; 
		if (typeof(choreValue) === 'object') {
			alert('returned an object');
			choreValue = choreValue.N;
		}
		var choreDescription = row.info.description;
		var tableRowData = {
			date: row.choreDate,
			value: choreValue,
			description: choreDescription
		};
		return tableRowData;
	}

	LoadTableData() {

		var params = {
			TableName: this.tableName,
			ProjectionExpression: "memberGuid, choreDate, info.choreValue, info.description",
			//KeyConditionExpression: "#yr = :yyyy",
			//ExpressionAttributeNames:{
			//	"#yr": "year"
			//},
			FilterExpression: "memberGuid = :memberGuidValue",
			ExpressionAttributeValues: {
				":memberGuidValue": this.memberGuid
			}
    	};
		this.LoadTableDataInternal(params)
	}

	LoadSingleMember(memberGuid, memberNameCallBack) {
		console.log("LOad Single Member");
		var memberDataAccess = new MemberDataAccess("MemberTable3", function() {
			console.log("Load Single Member Callback");
			var memberTableData = memberDataAccess.GetTableData();
			if (memberTableData.length === 1) {
				this.memberName = memberTableData[0].displayName;
				console.log("   memberName = " + this.memberName);
				memberNameCallBack(this.memberName);
			}
		});
		memberDataAccess.docClient = this.docClient;
		memberDataAccess.dynamodb = this.dynamodb;
		memberDataAccess.LoadSingleMemberFromGuid(memberGuid);
	}

	CreateChoresTable() {
		var params = {
			TableName : this.tableName,
			KeySchema: [       
				{ AttributeName: "memberGuid", KeyType: "HASH"},  //Partition key
				{ AttributeName: "choreDate", KeyType: "RANGE" }  //Sort key
			],
			AttributeDefinitions: [       
				{ AttributeName: "memberGuid", AttributeType: "S" },
				{ AttributeName: "choreDate", AttributeType: "S" }
			],
			ProvisionedThroughput: {       
				ReadCapacityUnits: 10, 
				WriteCapacityUnits: 10
			}
		};
		this.CreateTable(params);

	}

	AddNewChore(memberGuid, choreDate, choreValue, description) {
		var params = {
			TableName: this.tableName,
			Item: {
				"memberGuid": memberGuid,
				"choreDate": choreDate,
				"info": {
					"choreValue": choreValue,
					"description": description
				}
			}
		};
		this.AddRow(params);
	}

	DeleteChore(memberGuid, choreDate) {
		var params = {
			TableName: this.tableName,
			Key: {
				"memberGuid": memberGuid,
				"choreDate": choreDate
			}
		};
		this.DeleteRow(params);
	}

	UpdateChore(memberGuid, choreDate, value, description) {
		var params = {
			TableName: this.tableName,
			Key: {
				"memberGuid": memberGuid,
				"choreDate": choreDate
			},
			UpdateExpression: "set info.choreValue=:valueAmount, info.description=:descriptionValue",
			ExpressionAttributeValues: {
				":valueAmount": value,
				":descriptionValue": description
			}
		}
		this.UpdateRow(params);
	}
}

//export class MemberDataAccess;
//export class ChoreDetailsDataAccess;
//export default {MemberDataAccess, ChoreDetailsDataAccess};
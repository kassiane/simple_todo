import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


export const ChartData = new Mongo.Collection('chart');

ChartData.insert({x: 'Department Stores', value: 6371664});
ChartData.insert({x: 'Discount Stores', value: 7216301});
ChartData.insert({x: 'Men\'s/Women\'s Stores', value: 1486621});
ChartData.insert({x: 'Juvenile Specialty Stores', value: 786622});
ChartData.insert({x: 'All other outlets', value: 900000});

if(Meteor.isServer) {
	Meteor.publish('chart', function listDataSource(){
		console.log('chegou ao fim');
	    
	    return ChartData.find({});
	});
}
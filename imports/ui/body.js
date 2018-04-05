import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';


import './video_list.js';
import './body.html';

export const UserVideos = new Mongo.Collection('userVideos');
export const Users = new Mongo.Collection('vimeoUsers');

Template.body.onCreated(function bodyOnCreated() {
	Meteor.subscribe('userVideos');
	Meteor.subscribe('vimeoUsers');
});

Template.body.helpers({
	latestUserVideos() {
		var allUsers = Users.find({});
		const allLatestUsersInfo = new Mongo.Collection(null);

		allUsers.forEach(function(user){
			var latestUserVideosInfo = UserVideos.findOne({user_id: user.user_id}, {sort: {date_inserted: -1}});
			console.log('latestUserVideosInfo');
			console.log(latestUserVideosInfo);
			
			if(latestUserVideosInfo != null) {
				allLatestUsersInfo.insert(latestUserVideosInfo);	
			}
			
		});

		return allLatestUsersInfo.find({});
	},
});

Template.body.events({
	'submit .new-user'(event) {
		// Prevent default browser form submit
		event.preventDefault();
		console.log(event);

		// Get value from form element
		const target = event.target;
		const text = target.text.value;

		// Insert a task into the collection
		Meteor.call('vimeo.user.videos.insert', text);

		// Clear form
		target.text.value = '';
	},
});


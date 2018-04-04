import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';


import './video_list.js';
import './body.html';

export const UserVideos = new Mongo.Collection('userVideos');

Template.body.onCreated(function bodyOnCreated() {
	Meteor.subscribe('userVideos');
});

Template.body.helpers({
	userVideos() {
		return UserVideos.find();
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


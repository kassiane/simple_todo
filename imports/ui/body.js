import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';

 
import './video.js';
import './body.html';
import './chart_example.js';

const Videos = new Mongo.Collection('videos');

Template.body.onCreated(function bodyOnCreated() {
	Meteor.subscribe('videos');
});

Template.body.helpers({
 videos() {
  	return Videos.find();
  },
});

Template.body.events({
	'submit .new-video'(event) {
		// Prevent default browser form submit
		event.preventDefault();
		console.log(event);

		// Get value from form element
		const target = event.target;
		const text = target.text.value;

		// Insert a task into the collection
		Meteor.call('vimeo.videos.insert', text);

		// Clear form
		target.text.value = '';
	},
});
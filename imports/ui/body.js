import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import { Videos } from '../api/videos.js';

import './video.js';
import './body.html';
 
Template.body.helpers({
 videos() {
 	console.log(Videos.find({}));
  	return Videos.find({});
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
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';


import './video_list.js';
import './body.html';

const UserVideos = new Mongo.Collection('userVideos');

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

Template.videoList.onRendered(function funcss() {
	/*
	Get container for chart.
	It is not actually necessary here, `chart.container('container').draw();` can be used
	for current scope, but container is found in template to avoid container ID duplication.
	*/
	// Turn Meteor Collection to simple array of objects.
	var userVideos = UserVideos.find({}).fetch();
	var self = this;

	userVideos.forEach(function(user) {
		var chart;
		var containerId = "#container" + user.user_id;
		console.log('containerid: ' + containerId);
		var container = self.find(containerId);
		console.log('container');
		console.log(container);

		var videosList = user.video_list;

		var data = [];
		videosList.forEach(function(element) {
			data.push({x: element.title, value: element.stats_number_of_plays});
		});

		//  ----- Standard Anychart API in use -----
		chart = anychart.bar3d(data);
		chart.title(user.user_name +' Videos');

		chart.legend()
		.position('bottom')
		.itemsLayout('horizontal')
		.align('center');

		chart.animation(true);
		chart.container(container).draw();
	});

});
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
		var videosChart;
		var tagsChart;

		console.log("#container" + user.user_id);
		var container = self.find("#container" + user.user_id);
		var tagsContainer = self.find("#tagsContainer" + user.user_id);
		console.log('container');
		console.log(container);


		//  ----- Creating data for charts -----
		var videosList = user.video_list;

		var userTags = '';
		var data = [];
		videosList.forEach(function(element) {
			data.push({x: element.title, value: element.stats_number_of_plays});
			userTags = userTags + ' ' + element.tags;
		});

		//  ----- Creating the chart of videos -----
		videosChart = anychart.bar3d(data);
		

		videosChart.legend()
		.position('bottom')
		.itemsLayout('horizontal')
		.align('center');

		videosChart.title(user.user_name +' Videos');
		videosChart.container(container).draw();


		//  ----- Creating the chart of tags -----
		tagsChart = anychart.tagCloud();

		tagsChart.data(userTags, {
			mode: 'by-word',
			maxItens: userTags.length,
			ignoreItems: []
		});
		// create and configure a color scale.
		var customColorScale = anychart.scales.linearColor();
		customColorScale.colors(["#ffcc00", "#00ccff"]);

		// set the color scale as the color scale of the chart
		tagsChart.colorScale(customColorScale);

		// add a color range
		tagsChart.colorRange().enabled(true);

		tagsChart.angles([0, 90]);
		tagsChart.title(user.user_name +' Tags');
		tagsChart.container(tagsContainer).draw();
	});

});
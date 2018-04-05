import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Mongo } from 'meteor/mongo'; 
import { UserVideos } from './body.js';
import { Users } from './body.js';
import { moment } from 'meteor/momentjs:moment';

import './video_list.html';
 
Template.videoList.events({
	'click .delete'() {
		Meteor.call('vimeo.user.videos.remove', this.user_id);
	},
});

Template.videoList.onRendered(function funcss() {
	/*
	Get container for chart.
	It is not actually necessary here, `chart.container('container').draw();` can be used
	for current scope, but container is found in template to avoid container ID duplication.
	*/
	// Turn Meteor Collection to simple array of objects.
	var users = Users.find({});
	var self = this;

	users.forEach(function(user) {
		//  ----- Creating data for charts -----
		var userVideos = UserVideos.find({user_id: user.user_id}, {sort: {date_inserted: 1}}).fetch();
		var userName = userVideos[0].user_name;
		var videosList = userVideos[0].video_list;	

		var historicalData = generateHistoricalData(userVideos);
		var userTags = generateUserTagsList(videosList);

		//  ----- Creating the chart of videos -----
		// createVideosChart(self, user, videosListDataGenerated.data, userName);

		//  ----- Creating the chart of tags -----
		createTagsChart(self, user, userTags, userName);

		//  ----- Creating the chart lines -----
		createPlaysHistoricalChart(self, user, historicalData.playsData, userName);
		createLikesHistoricalChart(self, user, historicalData.likesData, userName);
		
	});

});

function generateHistoricalData(userVideos) {
	var playsData = anychart.data.set([]);
	var likesData = anychart.data.set([]);
	
	userVideos.forEach(function(userVideo) {
		var formattedDate = moment(userVideo.date_inserted).format('DD/MM/YY HH:mm');
		
		playsData.append([formattedDate, userVideo.user_all_plays]);
		likesData.append([formattedDate, userVideo.user_all_likes]);
	});

	return {playsData, likesData};
}

function generateUserTagsList(videosList) {
	var userTags = '';

	videosList.forEach(function(element) {
		userTags = userTags + ' ' + element.tags;
	});

	return userTags;
}



function createVideosChart(self, user, data, userName) {
	var videosChart;

	if(data.length != 0) {
		console.log("#container" + user.user_id);
		var container = self.find("#container" + user.user_id);
		
		videosChart = anychart.bar3d(data);
	
		videosChart.legend()
		.position('bottom')
		.itemsLayout('horizontal')
		.align('center');

		videosChart.title(userName +' Videos');
		videosChart.container(container).draw();
	}
}

function createTagsChart(self, user, userTags, userName) {
	var tagsChart;

	var tagsContainer = self.find("#tagsContainer" + user.user_id);
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
	tagsChart.title(userName +' Tags');
	tagsChart.container(tagsContainer).draw();
}

function createPlaysHistoricalChart(self, user, data, userName) {
	var tagsContainer = self.find("#playsChartContainer" + user.user_id);
	
	// create a chart
	chart = anychart.line();

	// create a line series and set the data
	var series = chart.line(data);
	
	// setting color and size
	series.normal().stroke("#ff3300", 4);
	series.hovered().stroke("#ff3300", 5);
	series.selected().stroke("#ff3300", 6);
	
	// set the container id
	chart.container(tagsContainer);
	chart.title(userName +' Plays History');
	
	// initiate drawing the chart
	chart.draw();
}

function createLikesHistoricalChart(self, user, data, userName) {
	var tagsContainer = self.find("#likesChartContainer" + user.user_id);
	
	// create a chart
	chart = anychart.line();

	// create a line series and set the data
	var series = chart.line(data);

	// setting color and size
	series.normal().stroke("#0000ff", 4);
	series.hovered().stroke("#0000ff", 5);
	series.selected().stroke("#0000ff", 6);

	// set the container id
	chart.container(tagsContainer);
	chart.title(userName +' Likes History');
	// initiate drawing the chart
	chart.draw();
}
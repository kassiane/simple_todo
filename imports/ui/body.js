import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';

 
import './video.js';
import './body.html';
import './chart_example.js';

const Videos = new Mongo.Collection('videos');
// const ChartData = new Mongo.Collection('chart');

Template.body.onCreated(function bodyOnCreated() {
	Meteor.subscribe('videos');
	Meteor.subscribe('chart');
});

Template.body.helpers({
 videos() {
  	return Videos.find();
  },
  videoId: function() {
    return Session.get('videoId');
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

var chart;

Template.acTemplate.rendered = function() {
  /*
    Get container for chart.
    It is not actually necessary here, `chart.container('container').draw();` can be used
    for current scope, but container is found in template to avoid container ID duplication.
   */
  var container = this.find("#container");

  // Turn Meteor Collection to simple array of objects.
  var videoData = Videos.find({}).fetch();

  var data = [];

  videoData.forEach(function(element) {
  	data.push({x: element.title, value: element.id});
  });
  
  console.log('Aqui');
  console.log(data);
  //  ----- Standard Anychart API in use -----
  chart = anychart.pie(data);
  chart.title('ACME Corp. apparel sales through different retail channels');

  chart.legend()
      .position('bottom')
      .itemsLayout('horizontal')
      .align('center')
      .title('Retail channels');

  chart.animation(true);
  chart.container(container).draw();
};
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

 
import './video.html';
 
Template.video.events({
	'click .delete'() {
		Meteor.call('vimeo.videos.remove', this._id);
	},
})
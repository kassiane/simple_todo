import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
 
import './video.html';
 
Template.video.events({
	'click .delete'() {
		Meteor.call('vimeo.videos.remove', this._id);
	},

	'click .video_selection'() {
		console.log("Adding video to session:", this.id);
        Session.set('videoId', this.id);
	}
})
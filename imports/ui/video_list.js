import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Mongo } from 'meteor/mongo'; 

import './video_list.html';
 
Template.videoList.events({
	'click .delete'() {
		Meteor.call('vimeo.user.videos.remove', this._id);
	},
})
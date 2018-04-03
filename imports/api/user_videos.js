import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const UserVideos = new Mongo.Collection('userVideos');

if(Meteor.isServer) {
	Meteor.publish('userVideos', function listUserVideos() {
		return UserVideos.find({});
	});
}


Meteor.methods({
	'vimeo.user.videos.insert'(id) {
		check(id, String);
		const videoUrl = 'http://vimeo.com/api/v2/' + id + '/videos.json';
		console.log('Adding a user in the database');
		
		// search video using video id
		HTTP.call('GET', videoUrl, null, function(error, response) {
			if(error){
				console.log('Error');
			} else {
				//save in the database
				UserVideos.insert({
					user_id: response.data[0].user_id,
					user_name: response.data[0].user_name,
					video_list: response.data
					}
				);
			}
		});
	},

	'vimeo.user.videos.remove'(id) {
		check(id, String);

		const video = UserVideos.findOne(id);
		UserVideos.remove(id);
	},
}); 
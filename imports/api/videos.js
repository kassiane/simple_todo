import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Videos = new Mongo.Collection('videos');

Meteor.methods({
	'vimeo.videos.insert'(id) {
		check(id, String);
		const videoUrl = 'https://vimeo.com/api/v2/video/' + id + '.json';

		// search video using video id
		HTTP.call('GET', videoUrl, null, function(error, response) {
			if(error){
				console.log('Error');
			} else {
				//save in the database
				console.log(response.data);
				Videos.insert(response.data);
			}
		});
	},
}); 
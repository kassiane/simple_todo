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
				var videosList = response.data;
				var allPlays = 0;
				var allLikes = 0;

				var tagsDict = {};

				videosList.forEach(function(video){
					allPlays += video.stats_number_of_plays;
					allLikes += video.stats_number_of_likes;
					
					var tags = video.tags;
					var array = tags.split(",").map(item => item.trim());
					console.log('tags');
					console.log(array.length);
					
					
					array.forEach(function(tag){
						var occurrences = tagsDict[tag];
						if(occurrences) {
							tagsDict[tag] = ++occurrences;
						} else {
							tagsDict[tag] = 1;
						}
					});
				});

				console.log('tagsDict');
				console.log(tagsDict);

				var allPlaysPerVideoAverage = allPlays/videosList.length;
				var allLikesPerVideoAverage = allLikes/videosList.length;

				console.log('all plays: ' + allPlays);
				console.log('allPlaysPerVideoAverage: ' + allPlaysPerVideoAverage);
				console.log('allLikesPerVideoAverage: ' + allLikesPerVideoAverage);

				//save in the database
				UserVideos.insert({
					user_id: response.data[0].user_id,
					user_name: response.data[0].user_name,
					user_thumbnail_large: response.data[0].user_portrait_large,
					user_total_videos: videosList.length, 
					user_all_plays: allPlays,
					user_all_likes: allLikes,
					user_all_plays_average: allPlaysPerVideoAverage,
					user_all_likes_average: allLikesPerVideoAverage,
					tags_dictionary: tagsDict,
					video_list: videosList
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
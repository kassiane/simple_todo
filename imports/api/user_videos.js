import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const UserVideos = new Mongo.Collection('userVideos');
export const Users = new Mongo.Collection('vimeoUsers');

if(Meteor.isServer) {
	Meteor.publish('userVideos', function listUserVideos() {
		return UserVideos.find({});
	});
	Meteor.publish('vimeoUsers', function listUsers() {
		return Users.find({});
	});
}

function insertUserVideo(response) {
	var videosList = response.data;
	var allPlays = 0;
	var allLikes = 0;

	videosList.forEach(function(video){
		allPlays += video.stats_number_of_plays;
		allLikes += video.stats_number_of_likes;
	});

	var allPlaysPerVideoAverage = allPlays/videosList.length;
	var allLikesPerVideoAverage = allLikes/videosList.length;

	console.log('all plays: ' + allPlays);
	console.log('allPlaysPerVideoAverage: ' + allPlaysPerVideoAverage);
	console.log('allLikesPerVideoAverage: ' + allLikesPerVideoAverage);

	//save in the database
	UserVideos.insert({
		user_id: response.data[0].user_id,
		date_inserted: Date.now(),
		user_name: response.data[0].user_name,
		user_thumbnail_large: response.data[0].user_portrait_large,
		user_total_videos: videosList.length, 
		user_all_plays: allPlays,
		user_all_likes: allLikes,
		user_all_plays_average: allPlaysPerVideoAverage,
		user_all_likes_average: allLikesPerVideoAverage,
		video_list: videosList
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
				insertUserVideo(response);
				Users.insert({user_id: response.data[0].user_id});
			}
		});
	},

	'vimeo.user.videos.remove'(userId) {
		check(userId, Number);

		// const videos = UserVideos.find({user_id: userId});
		// videos.forEach(function(video){
		// 	UserVideos.remove(video._id);
		// });		

		const video = Users.findOne({user_id: userId});
		Users.remove(video._id);
	},
}); 

export {insertUserVideo};
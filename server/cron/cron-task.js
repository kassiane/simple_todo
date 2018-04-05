import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { Users } from '../../imports/api/user_videos.js';
import { insertUserVideo } from '../../imports/api/user_videos.js';
import { HTTP } from 'meteor/http';

if (Meteor.isServer) {
  SyncedCron.add({
    name: 'Update historical videos data',
    schedule: function (parser) {
      // parser is a later.parse object
      return parser.text('every 30 minutes');
    },
    job: Meteor.bindEnvironment(function () {
      var usersList = Users.find({}).fetch();
      console.log('Listing users');
      console.log(usersList);
      
      usersList.forEach(function(user){
        const videoUrl = 'http://vimeo.com/api/v2/' + user.user_id + '/videos.json';

        HTTP.call('GET', videoUrl, null, function(error, response) {
          if(error){
            console.log('Error');
          } else {
            console.log('inserting a new entry for user ' + user.user_id);
            insertUserVideo(response);
          }
        });
      
      });

    })
  });

  SyncedCron.start();
}
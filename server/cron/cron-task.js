import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { Users } from '../../imports/api/user_videos.js';

if (Meteor.isServer) {
  SyncedCron.add({
    name: 'Update historical videos data',
    schedule: function (parser) {
      // parser is a later.parse object
      return parser.text('every 2 hours');
    },
    job: Meteor.bindEnvironment(function () {
      var usersList = Users.find({}).fetch();
      console.log('Listing users');
      console.log(usersList);
    })
  });

  SyncedCron.start();
}
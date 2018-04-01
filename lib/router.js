import { Session } from 'meteor/session';

FlowRouter.route('/chart/:videoId', {
    action: function(params, queryParams) {
        console.log("Yeah! We are on the video:", params.videoId);
        Session.set('videoId', params.videoId);
    }
});
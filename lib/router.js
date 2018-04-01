FlowRouter.route('/chart/:videoId', {
    action: function(params, queryParams) {
        console.log("Yeah! We are on the video:", params.videoId);
    }
});
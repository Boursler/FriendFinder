
var friendData = require("../data/friends.js");

module.exports = function (app) {
	//A GET route with the url /api/friends. This will be used to display a JSON of all possible friends.
	app.get("/api/friends", function (req, res) {
		res.json(friendData);
	});
	// A POST routes /api/friends. This will be used to handle incoming survey results. This route will also be used to handle the compatibility logic.
	app.post("/api/friends", function (req, res) {
		var bestFriend = {};
		var best_friend_index;
		var diffAgg = [];
		var sameDiff = [];
		selfArr = req.body.scores;
		console.log("from server: " + selfArr);
		//for finding friends: create an array of the lowest total difference, select a random index w/in that array. If there is only 1, that person will be selected. If more than 1, a random choice
		//iterate over friendData to compare against each friend in friendData
		for (let i = 0; i < friendData.length; i++) {
			//friendData is an array of objects
			//also, keep track of which friend has which scores
			var scores = friendData[i].scores;
			var friend = friendData[i].name;
			//reset diffArr when comparing against different friends
			var diffArr = [];
			for (let i = 0; i < scores.length; i++) {
				//values are stored as strings in friendData. Parse them when they are needed.
				var diff = Math.abs(parseInt(scores[i]) - parseInt(selfArr[i]));
				//add to diffArr as an object to maintain identity as well as diff
				diffArr.push({ diff: diff, friend: friend });
			}
			//reset total differences at the start of each new build
			var total_diff = 0;
			for (let i = 0; i < diffArr.length; i++) {
				//sum diffs to form aggregate array
				total_diff += diffArr[i].diff;
				// console.log("total diff " + total_diff);
				friend = diffArr[i].friend;
			}
			//push to aggregate array
			diffAgg.push({ total_diff: total_diff, name: friend });
		}
		// sort aggregate array
		diffAgg = diffAgg.sort(function (a, b) {
			return a.total_diff - b.total_diff;
		});
		//the 0th index is the smallest number. This is a guaranteed match
		sameDiff.push(diffAgg[0]);
		//search for other matches and create an array of matches
		for (let i = 1; i < diffAgg.length; i++) {
			let lowest = diffAgg[0].total_diff;
			let compare = diffAgg[i].total_diff;
			if (lowest === compare) {
				sameDiff.push(diffAgg[i]);
			}
		}
		//select a random match. If there is only 1 match, then this will be chosen from a list of length 1. The assumption is that anyone with the same totalDiff is equally compatible and so any can be returned
		best_friend_index = Math.floor(Math.random() * sameDiff.length);
		bestFriend = sameDiff[best_friend_index];
		//find the matching object stored in friendData, searching by name which has been retained throughout the process
		for (let i = 0; i < friendData.length; i++) {
			if (friendData[i].name === bestFriend.name) {
				bestFriend = { name: friendData[i].name, photo: friendData[i].photo };
			}

		}
		console.log(bestFriend + " best friend ever 2");
		//now that operations are done, it is safe to add the new friend to friendData. Since neither fs nor a database is in use, additions will not persist after the server connection is closed.
		friendData.push(req.body);
		//send the bestFriend match to the client
		res.json(bestFriend);
	});
}

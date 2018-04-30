console.log("hello world");
var friendData = require("../data/friends.js");

console.log(JSON.stringify(friendData[0]));
//A GET route with the url /api/friends. This will be used to display a JSON of all possible friends.
// A POST routes /api/friends. This will be used to handle incoming survey results. This route will also be used to handle the compatibility logic.

module.exports = function (app) {
	app.get("/api/friends", function (req, res) {
		res.json(friendData);
	});
	app.post("/api/friends", function (req, res) {
		var bestFriend = {};
		var best_friend_index;
		var diffAgg = [];
		var sameDiff = [];

		selfArr = req.body.scores;
		console.log("from server: " + selfArr);
		//compatability logic
		//for finding friends: create an array of the lowest total difference, select a random index w/in that array. If there is only 1, that person will be selected. If more than 1, a random choice
		for (let i = 0; i < friendData.length; i++) {
			var scores = friendData[i].scores;
			var friend = friendData[i].name;
			var diffArr = [];
			for (let i = 0; i < scores.length; i++) {
				// console.log("self" + scores);
				// console.log("friend " + selfArr);
				var diff = Math.abs(parseInt(scores[i]) - parseInt(selfArr[i]));
				console.log("diff " + diff);

				diffArr.push({ diff: diff, friend: friend });
				console.log(diffArr);
			}
			// console.log(diffArr);
			var total_diff = 0;
			for (let i = 0; i < diffArr.length; i++) {

				total_diff += diffArr[i].diff;
				console.log("total diff " + total_diff);
				friend = diffArr[i].friend;
			}
			diffAgg.push({ total_diff: total_diff, name: friend });
		}
		console.log("diffAgg before sort " + JSON.stringify(diffAgg));
		diffAgg = diffAgg.sort(function (a, b) {
			return a.total_diff - b.total_diff;
		});
		sameDiff.push(diffAgg[0]);
		for (let i = 1; i < diffAgg.length; i++) {
			let lowest = diffAgg[0].total_diff;
			let compare = diffAgg[i].total_diff;
			if (lowest === compare) {
				sameDiff.push(diffAgg[i]);
			}
		}
		console.log("same diff " + JSON.stringify(sameDiff));

		best_friend_index = Math.floor(Math.random() * (sameDiff.length + 1));
		bestFriend = sameDiff[best_friend_index];
		console.log(JSON.stringify(bestFriend) + " best friend ever");
		for (let i = 0; i < friendData.length; i++) {
			if (friendData[i].name === bestFriend.name) {
				bestFriend = friendData[i].name + friendData[i].photo;
			}

		}
		console.log(bestFriend + " best friend ever 2");
		// console.log("diffAgg " + JSON.stringify(diffAgg));
		//add selfArr to friendData at some point here
		res.json(bestFriend);
		friendData.push(req.body);
		console.log(JSON.stringify(friendData));
	});
}

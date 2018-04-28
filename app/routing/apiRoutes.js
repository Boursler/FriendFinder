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
		var lowest_diff = [];
		console.log("from server: " + JSON.stringify(req.body));
		//compatability logic
		//for finding friends: create an array of the lowest total difference, select a random index w/in that array. If there is only 1, that person will be selected. If more than 1, a random choice
		res.json(true);
	});
}

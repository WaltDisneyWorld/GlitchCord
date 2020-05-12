// clear database collection 'messages'
// CLEARS MESSAGE HISTORY


var mongoose = require('mongoose');
var db = mongoose.connection;
var Schema = mongoose.Schema;

db.on('error', console.error);

db.once('open', function () {
    console.log("db connect");
    db.dropCollection("messages", function (err, result) {
        if (err) {
            console.log("error delete collection");
        } else {
            console.log("delete collection success");
        }
    });
});

mongoose.connect(process.env.DATABASEURL);

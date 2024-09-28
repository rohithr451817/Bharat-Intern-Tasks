var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/Database');
var db = mongoose.connection;
db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

app.post("/sign_up", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var data = {
        "name": name,
        "email": email,
        "password": password
    };

    db.collection('users').findOne({ email: email }, (err, user) => {
        if (err) {
            console.error(err);
            return res.redirect('error.html');
        }

        if (user) {
            return res.redirect('error.html'); // Redirect to error page if email already exists
        }

        db.collection('users').insertOne(data, (err, collection) => {
            if (err) {
                console.error(err);
                return res.redirect('error.html');
            }
            console.log("Record Inserted Successfully");
            return res.redirect('signup_successful.html');
        });
    });
});

app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('index.html');
}).listen(3000);

console.log("Listening on port 3000");

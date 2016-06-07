var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var app = express();
var db = mongojs('contacts',['contacts']);
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

app.get('/resp',function (req,res){
		console.log("returning first response");
	res.send("this is my first node get response")
});

app.get('/contacts',function (req,res){
	console.log("received a GET request for returning all contacts List");
	db.contacts.find(function(err,docs){
		console.log(docs);
		res.json(docs);
	});
});


app.post('/add_contact',function(req,res){
	console.log("received a POST request for adding contact to db");
	db.contacts.insert(req.body,function(err,docs){
		res.json(docs);
	});
});

app.delete('/del_contact/:id',function(req,res){
	console.log("received a Delete request for removing contact from db");
	var id = req.params.id;
	db.contacts.remove({_id: mongojs.ObjectId(id)},function(err,docs){
		res.json(docs);
	});
});


app.get('/get_contact/:id',function(req,res){
	console.log("received a GET request for Particular contact from db");
	var id = req.params.id;
	db.contacts.findOne({_id: mongojs.ObjectId(id)},function(err,docs){
		res.json(docs);
	});
});


app.put('/update_contact/:id',function(req,res){
	console.log("received a GET request for Particular contact from db");
	var id = req.params.id;
	db.contacts.findAndModify({query:{_id: mongojs.ObjectId(id)},
		update: {$set:{name:req.body.name,email:req.body.email,number:req.body.number}},
		new:true},function(err,docs){
		res.json(docs);
	});
});


app.listen(3000);
console.log("server running on port 3000 .......");
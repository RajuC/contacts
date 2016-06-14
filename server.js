var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var multer = require("multer");
var app = express();
var db = mongojs('contacts',['contacts']);
app.use(bodyParser.json());

var _ = require('underscore');

app.use(express.static(__dirname + "/public"));

app.use(express.static(__dirname + "/upload"));

//app.use(multer({dest: './upload/'}));
//app.use(multer({dest:'./upload/'}).single('photo'));


var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './upload');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now()+ '.jpg');
  }
});

var upload = multer({ storage : storage}).single('photo');



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


app.post('/upload',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
    console.log("received a POST request for adding contact to db...");
    console.log(req.body);
    console.log("================");
    console.log(req.file);      
	var newdata = {"path" : req.file.path,"filename" : req.file.filename};
	var target = _.extend(req.body, newdata);
//	absorb(fullbody, newdata);
//	var fullbody = $.extend(true, req.body, newdata);
	console.log("object stored in DB...");	
    console.log(target);
	db.contacts.insert(target,function(err,docs){
		console.log("File is uploaded...");
		res.redirect('http://localhost:3000');
    	});
	});
});



/*
	app.post('/upload', function(req, res){
		console.log(req);
		console.log("body");
		console.log(req.body);
		console.log("1==============");
		console.log(req.file);
		console.log("2==============");		
//		res.json({success: true});
		res.end("File is uploaded");
	});

*/	

app.listen(3000);
console.log("server running on port 3000 .......");
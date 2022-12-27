require("dotenv").config()
const request = require("request")
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const https = require("https")
const { parse } = require("path")
app.use(express.static(__dirname))
//app.use(express.static(__dirname + "/public")) --> NOT WORKING
//app.use(express.static("public")); --> NOT WORKING

app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", function (request, response) {
	response.sendFile(__dirname + "/signup.html")
})
app.post("/", function (request, response) {
	const firstname = request.body.firstname
	const lastname = request.body.lastname
	const email = request.body.email
	const PhoneNumber = request.body.Phonenumber
	//console.log(request.body.Phonenumber);
	//const RepeatPassword = request.body.RepeatPassword
	//console.log(request.body.email);
	//console.log(request.body.Password)
	//console.log(request.body.RepeatPassword)
	const data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: firstname,
					LNAME: lastname,
					PHONE: PhoneNumber,
				},
			},
		],
	}
	const jsonData = JSON.stringify(data)

	const url = process.env.URL

	const options = {
		method: "POST",
		auth: process.env.API,
	}
	const req = https.request(url, options, function (res) {
		if (res.statusCode === 200) {
			response.sendFile(__dirname + "/success.html")
		} else {
			response.sendFile(__dirname + "/failure.html")
		}
		res.on("data", function (data) {
			console.log(JSON.parse(data))
		})
	})
	req.write(jsonData)
	req.end()
})
//failure route
app.post("/failure", function (request, response) {
	response.redirect("/")
})
app.listen(process.env.PORT || 3000, function () {
	console.log("Server is running on port 3000")
})


/*
GFG SOLUTION
// import required packages
const express= require("express");
const https= require("https");
const bodyparser= require("body-parser");

const app= express();
app.use(express.static("public"));

app.use(bodyparser.urlencoded({extended:true}));

// On the home route, send signup html template
app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

// Manage post request on home route and
// Send data to the MailChimp account via API
app.post("/",function(req,res){
  var firstName=req.body.Fname;
  var email=req.body.Email;
  var password=req.body.password;

  var data={
    members:[{
      email_address: email,
      status: "subscribed",
      merge_fields:{
        FNAME: firstName,
        LNAME: password
      }
    }]
  }

// Converting string data to JSON data
const jsonData= JSON.stringify(data);
const url="https://us14.api.mailchimp.com/3.0/lists/f4f5ad20f7";
const options={
  method:"POST",
  auth:"201951173:acfa4fffd113041454c6d953a71fa3e5-us14"
}

// On success send users to sucees, otherwise on failure template
const request=https.request(url,options,function(response){
  if(response.statusCode===200){
    res.sendFile(__dirname+"/success.html");
  }else{
    res.sendFile(__dirname+"/failure.html");
  }
  response.on("data",function(data){
    console.log(JSON.parse(data));
  });
});
  request.write(jsonData);
  request.end();
});

// Failure route
app.post("/failure",function(req,res){
   res.redirect("/");
})

app.listen(8000,function(){
  console.log("server is running on port 8000.");
})
*/

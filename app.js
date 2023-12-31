const express = require('express');
const request = require('request');
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true})); 

app.get('/', function(req, res){
  res.sendFile(__dirname + "/signup.html"); 
});


app.post("/", function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us8.api.mailchimp.com/3.0/lists/e45a6b303d";

  const options = {
    method: "POST",
    auth: "soumik:270626ba3e08fc06d88b28629b025b9a-us8"
  }

  const request = https.request(url, options, function(response){
      if(response.statusCode === 200)
      {
        res.sendFile(__dirname + "/success.html");
      }
      else
      {
        res.sendFile(__dirname + "/failure.html");
      }

      response.on("data", function(data){
        console.log(JSON.parse(data));
      })
  });

  // request.write(jsonData); 
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000,  function(){
  console.log("Server is running on port 3000");
});

//mailchimp api key: 270626ba3e08fc06d88b28629b025b9a-us8
//list-id or audience-id both are the same thing: e45a6b303d

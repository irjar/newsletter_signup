// jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

// Post request for the home route
app.post("/", function(req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }

  const jsonData = JSON.stringify(data);
  const url = "https://us7.api.mailchimp.com/3.0/lists/xxx";
  const options = {
    method: "POST",
    auth: "api_key"
  }

  //  Make a request to the Mailchimp server
  const request = https.request(url, options, function(response) {
    // Show the success.html or failure.html pages
    // depending on the reponse code from the Mailchimp server
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })

  })

  // Pass the data to the Mailchimp server
  request.write(jsonData);
  request.end();
});

// Redirect to the home page if there was an error with signing up
app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("Server is running on port 3000.");
})


const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const uri = require(__dirname + "/mongodburl.js");
const url = Object.values(uri).toString();
mongoose.connect(url, { useNewUrlParser: true});


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

const postSchema = new mongoose.Schema({
  title: String,
  body: String
})

const Post = mongoose.model("Post", postSchema);

var posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  Post.find({})
    .then(function(posts) {
      if(posts) {
        res.render("home", {
          homeContent: homeStartingContent,
          posts: posts
        })
      }
    })
});

app.get("/about", function(req, res) {
  res.render("about", {aboutPage: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render("contact", {contactPage: contactContent});
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = {
    title: req.body.postTitle, 
    body: req.body.postText
  };

  const postTitle = post.title;
  const postBody = post.body;

  Post.findOne({title: post.title})
    .then(function(foundPost) {
      if(!foundPost) {
        const newPost = new Post ({
          title: postTitle,
          body: postBody
        })
        console.log("New post created!");
        newPost.save()
          .then(function(post) {
            if(post) {
              res.redirect("/");
            }
          }) 
      }
      else {
        console.log("You already have a post with this title!");
      }
    })
});

app.get("/posts/:postId", function(req, res) {
  const postId = req.params.postId;

  Post.findOne({_id: postId})
    .then(function(post) {
      if (post) {
        res.render("post", {
          title: post.title,
          body: post.body
        })
      }
    })
  // posts.forEach(post => {
  //   const postTitle = _.lowerCase(post.title);
  //   if (postTitle === postName) {
  //     res.render("post", {
  //       postTitle: post.title, 
  //       postContent: post.body
  //     })
  //   }
  // })
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});

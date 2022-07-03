const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set("view-engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// connecting database
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get((req, res) => {
        Article.find((error, articles) => {
            if(!error) {
                res.send(articles);
            } else {
                res.send(error);
            }
        });
    })
    .post((req, res) => {
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        })
        article.save((error) => {
            if(!error) {
                res.send("Item added successfully");
            } else {
                res.send(error);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany((error) => {
            if(!error) {
                res.send("Items deleted succesfully");
            } else {
                res.send(error);
            }
        });
    });

app.route("/articles/:articleTitle")
    .get((req, res) => {
        const requestedTitle = req.params.articleTitle;
        Article.findOne({title: requestedTitle} ,(error, article) => {
            if(!error) {
                res.send(article);
            } else {
                res.send(error);
            }
        });
    })
    .put((req, res) => {
        const requestedTitle = req.params.articleTitle;
        Article.findOneAndUpdate(
            {title: requestedTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            (error) => {
            if(!error) {
                res.send("Item replaced successfully");
            } else {
                res.send(error);
            }
        });
    })
    .patch((req, res) => {
        const requestedTitle = req.params.articleTitle;
        Article.updateOne(
            {title: requestedTitle},
            req.body,
            (error) => {
            if(!error) {
                res.send("Item updated successfully");
            } else {
                res.send(error);
            }
        });
    })
    .delete((req, res) => {
        const requestedTitle = req.params.articleTitle;
        Article.deleteOne({title: requestedTitle}, (error) => {
            if(!error) {
                res.send("Item deleted successfully");
            } else {
                res.send(error);
            }
        });
    });

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
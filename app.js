//jshint esversion:6

const bodyParser = require('body-parser');
const express=require('express');
const mongoose = require('mongoose');
const ejs = require("ejs");
const req = require('express/lib/request');

const app=express();

app.set('view engine',ejs);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema={
    title:String,
    content:String
}

const Article=mongoose.model("Article",articleSchema);

///////////////////Requests targeting all articles///////////////////////

app.route("/articles")

.get(function(req,res){
    {
        Article.find({},function(err,foundArticles){
            if(!err){
                res.send(foundArticles);
            }   
    });
    }
})

.post(function(req,res){
    
    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send("successfully added a new article!");
        }
        else{
            res.send(err);
        }
    });
})

.delete(function(req,res){

    Article.deleteMany({},function(err){
        if(!err){
            res.send("Successfully deleted all articles!");
        }
        else{
            res.send(err);
        }
    });

});


///////////////////Requests targeting specific articles///////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){

    Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }
        else{
            res.send("No matching articles found!");
        }
    });
})

.put(function(req,res){
    Article.replaceOne(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        function(err){
            if(!err){
                res.send("Successfully updated article");
            }
            else{
                res.send("error while updating article");
            }
    });
})

.patch(function(req,res){
    Article.updateOne(
        {title:req.params.articleTitle},
        {$set:req.body},
        function(err){
            if(!err){
                res.send("successfulyy updated article");
            }
            else{
                res.send("some error occured");
            }
        }
    );
})

.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articleTitle},
        function(err){
            if(!err){
                res.send("item deleted successfully!");
            }
            else{
                res.send("some error occured");
            }
        }
    );
});


app.listen(3000,function(){
    console.log("Server started successfuly!");
});

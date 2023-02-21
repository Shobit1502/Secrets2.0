require('dotenv').config()
const express=require('express');
const mongoose=require('mongoose');
const bodyParser =require('body-parser');
const encrypt = require('mongoose-encryption');
const app=express();
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/userDB');
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
const userSchema=new mongoose.Schema({
    email: String,
    password: String
})

//var secret = process.env.SOME_LONG_UNGUESSABLE_STRING;
userSchema.plugin(encrypt, { secret: process.env.SECRET,  encryptedFields: ['password']});
const User=mongoose.model("User",userSchema);
app.get("/",function(req,res){
    res.render("home");
})
app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
})
app.post("/register",function(req,res){
    const user=new User({
        email:req.body.username,
        password:req.body.password
    })
    user.save(function(err){
        if(err)console.log(err);
        else {
            console.log("User Successfully registered.");
            res.render("secrets");
        }
    })
    
})
app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username},function(err,result){
        if(err)console.log(err);
        else {
            if(!result)res.redirect("/")
            else{
                if(result.password==password){
                    console.log("User Successfully Signed In.");
                    res.render("secrets");
                }
                
            } 
        }
    })
    
})
app.listen(3000,function(req,res){
    console.log("Server satrted on port 3000");
})
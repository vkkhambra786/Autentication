const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require('../models/users.models');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');
const authenticate = require('../middlewares/authenticate');


const transporter = nodemailer.createTransport({ //syntax to integrate own gmail with nodemailer to send emails;
    service: 'gmail',
    auth: {
           user: process.env.USER,
           pass: process.env.PASSWORD
       }
   });

const newToken = (user) => {
    return jwt.sign({user}, process.env.JWT_SECRET_KEY);
}
//Register 
router.post('/register',async (req,res) => {
    let user;
    try{
        // First we check if user with same email already exists
        user = await User.findOne({email: req.body.email})

        // if yes then we throw an error that email already exists
        if (user) return res.status(400).send({message: "Please check your email and password"});
        
        // else we will create the user with the email and password 
        // but before saving the password we need to hash it
        user = await User.create(req.body);
        
        // we will create a token
         const token = newToken(user)
        
        // we will send the token to the frontend
        let msg ="Congratulations account successfully created";
        const {password,...others} = user._doc;//avoid sending password
        //return res.status(200).send({msg,others,token});
        const mailOptions = {
            from: process.env.USER, // sender address
            to: user.email, // list of receivers
            subject: 'Account Created Successfully', // Subject line
            html: `<div> <h1>Hey ${user.username} Welcome to our Website XYZ`// plain text body
          };
          transporter.sendMail(mailOptions, function (err, info) {
            if(err)
              console.log(err)
            else
              console.log(info);
         });
        return res
        .cookie("access_token", token, {
            expires: new Date(Date.now() + 60000 * 60),
          httpOnly: true,
          secure: process.env.MODE === "production",
        })
        .status(200)
        .json({ message: msg,status:true });
    }catch(err){
        return res.status(500).send(err);
    }
})
//Login
router.post("/login",async(req,res)=>{
    try{
        // First we will check if user with same email already exists
        const user = await User.findOne({email: req.body.email});
        // if not exists we throw an error
        if(!user) return res.status(400).send("Wrong Credentials");
        // if it exists then we match the password
        let match = user.checkPassword(req.body.password);
        // if not match then we throw an error
        
        !match && res.status(400).send({message: "Wrong Credentials"});
        //we dont want to show password to user , so hiding the password using spread operator
        const {password,...others} =user._doc;

        const token = newToken(user) //if everything ok, sending json web token for the user;
        //saving the token into cookies using cookies-parser;
        return res
    .cookie("access_token", token, {
        expires: new Date(Date.now() + 60000 * 60),
      httpOnly: true,
      secure: process.env.MODE === "production",
    })
    .status(200)
    .json({ message: "Logged in successfully 😊 👌" });
        // return res.status(200).send({token,others});

    }catch(err){
        return res.status(500).send(err)
    }
})
//Forgot Password
router.post('/resetpassword',async(req,res)=>{
    try{
        // First we will check if user with same email already exists
        const user = await User.findOne({email: req.body.email});
        // if not exists we throw an error
        if(!user) return res.status(400).send("User not exists");
        
        //User exists now create a one time reset link which will be valid for 10 minutes;
        const secret = process.env.JWT_SECRET_KEY + user.password;
        console.log(process.env.JWT_SECRET_KEY)
        const payload ={
            email:user.email,
            id:user.id,
        }
        const token = jwt.sign(payload,secret,{expiresIn: '5m'});//creating token with the expire time of 5 minutes
        const link= `http://localhost:7448/blog/reset-password/${user.id}/${token}`;
        const mailOptions = {
            from: process.env.USER, // sender address
            to: user.email, // list of receivers
            subject: 'Here is the mail regarding password reset', // Subject line
            html: `<div> <h1>Hey ${user.username} Please click on the given link below to reset the password</h1><a href=${link}>Click me</a></div>`// plain text body
          };
          transporter.sendMail(mailOptions, function (err, info) {
            if(err)
              console.log(err)
            else
              console.log(info);
         });
        //console.log(link);
        return res.status(200).send("Password reset link has been sent to your email");

    }catch(err){
        return res.status(500).send(err)
    }
})
//Getting the data from the user after making a reset password to place where he can reset password
router.get('/reset-password/:id/:token',async (req,res)=>{
    try{
        const {id,token} = req.params;
        const user = await User.findOne({id: id})
        if(!user) return res.status(400).send("Something went wrong");
        //If user exits means valid id with valid user;
        const secret = process.env.JWT_SECRET_KEY+user.password;//since this here we havent change the password yet;

        const payload = jwt.verify(token,secret);
        if(!payload) return res.status(400).send("Token Invalid");
         res.redirect(`http://localhost:3000/${id}/${token}`);
    }catch(err){
        return res.status(500).send(err.message)
    }
})
//Final hit to the reset api to post new password;
router.post('/reset-password/:id/:token',async (req,res)=>{
    try{
      const {id,token} = req.params;
      const {password,password2} = req.body;
      const user = await User.findById(id)
        if(!user) return res.status(400).send("Something went wrong");
        const secret = process.env.JWT_SECRET_KEY+user.password;//since this here we havent change the password yet;

        const payload = jwt.verify(token,secret);
        if(!payload) return res.status(400).send("Token Invalid");
        //validate password and password2 should match
        if(password !=password2) return res.status(400).send("Invalid Password");
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password,salt);
        const newUser = await User.findByIdAndUpdate(id,{password:req.body.password},{new:true});
        return res.status(400).send(newUser)
    }catch(err){
        return res.status(500).send(err.message)
    }
})

router.get("/geter",authenticate,async function(req, res){
    return res.status(200).send("Hello")
})

router

module.exports = router;

  
  
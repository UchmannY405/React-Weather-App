const express = require('express');
const {loginSchema,registerSchema}= require('../validation/authSchemas');
const {validate}= require('../validation/validate');
const User = require('../models/User');
const dashAuth = require('../middleware/dashAuth')
const JWT = require('jsonwebtoken');

const Route = express.Router();

Route.post('/register',validate(registerSchema),async (req,res)=>{
    const user = await User.create(req.body);

    if(!user)
    {
      throw new Error('User not created')
    }
    res.status(201).json({user});
})


Route.post("/login", validate(loginSchema),async(req, res) => {
  const {email,password}=req.body;

  const user = await User.findOne({email});

  if(!user)
  {
    throw new Error('User not found')
  }

  const isCorrectPassword = await user.verifyPassword(password);

  if(!isCorrectPassword)
  {
    throw new Error('user credentials is incorrect')
  }

  const token = JWT.sign({userID:user._id,name:user.name},process.env.JWT_SECRET,{expiresIn:"30d"});

  res.status(200).json({ msg: "Login Successful", token });
});

Route.get("/me",dashAuth,(req, res) => {
  res.status(200).json({ msg: "Who Am I Route" }); //used to fetch user during initial appload
});

module.exports=Route;
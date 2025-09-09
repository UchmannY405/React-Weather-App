const express = require('express');
const {loginSchema,registerSchema}= require('../validation/authSchemas');
const {validate}= require('../validation/validate');
const User = require('../models/User');
const dashAuth = require('../middleware/dashAuth')
const JWT = require('jsonwebtoken');
const { BadRequestError, NotFoundError, UnauthenticatedError } = require('../errors/customAPIError');
const {StatusCodes} = require('http-status-codes')

const Route = express.Router();

Route.post('/register',validate(registerSchema),async (req,res)=>{
    const user = await User.create(req.body);

    if(!user)
    {
      throw new BadRequestError('User not created','USER_CREATION_FAILED')
    }
    res.status(StatusCodes.CREATED).json({user});
})


Route.post("/login", validate(loginSchema),async(req, res) => {
  const {email,password}=req.body;

  const user = await User.findOne({email});

  if(!user)
  {
    throw new NotFoundError('User not found','USER_NOT_FOUND');
  }

  const isCorrectPassword = await user.verifyPassword(password);

  if(!isCorrectPassword)
  {
    throw new UnauthenticatedError('Invalid credentials','INVALID_CREDENTIALS')
  }

  const token = JWT.sign({userID:user._id,name:user.name},process.env.JWT_SECRET,{expiresIn:"30d"});

  res.status(StatusCodes.OK).json({ msg: "Login Successful", token });
});

Route.get("/me",dashAuth,(req, res) => {
  res.status(StatusCodes.CREATED).json({ msg: "Who Am I Route" }); //used to fetch user during initial appload
});

module.exports=Route;
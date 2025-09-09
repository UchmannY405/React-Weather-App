const express = require("express");
const Route = express.Router();
const bcrypt = require("bcryptjs");
const User = require('../models/User');
const {updateProfileSchema,changePasswordSchema} = require('../validation/authSchemas')
const {validate} = require('../validation/validate');
const { UnauthenticatedError, NotFoundError } = require("../errors/customAPIError");
const {StatusCodes} = require("http-status-codes");

Route.get('/me',async (req,res)=>{
    const { name } = req.user;

    if(!name)
    {
      throw new UnauthenticatedError('Unauthorized user','AUTH_REQUIRED')
    }

    res.status(StatusCodes.OK).json({msg:`Welcome ${name}!`});
})

Route.patch("/me",validate(updateProfileSchema),async (req, res) => {
  const { userID } = req.user;

  if (!userID) {
    throw new UnauthenticatedError("Unauthorized user", "AUTH_REQUIRED");
  }

  const user = await User.findByIdAndUpdate({_id:userID},req.body,{new:true});

  if (!user)
  {
    throw new NotFoundError('User Not found','USER_NOT_FOUND');
  }

  res.status(StatusCodes.OK).json({user});


});

Route.patch("/me/password",validate(changePasswordSchema),async (req, res) => {
  const {userID} = req.user;

  const {currentPassword, newPassword} = req.body;

  if (!userID) {
     throw new UnauthenticatedError("Unauthorized user", "AUTH_REQUIRED");
  };

  const user = await User.findById(userID);

  if (!user) {
     throw new NotFoundError("User Not found", "USER_NOT_FOUND");
  }

  const isCorrectPassword = user.verifyPassword(currentPassword,user.password);

  if(!isCorrectPassword)
  {
    throw new UnauthenticatedError('Incorrect credentials', 'INVALID_CREDENTIALS');
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(newPassword, salt);

  const updatedUser = await User.findByIdAndUpdate({_id:userID},{password},{new:true})

  res.status(StatusCodes.OK).json({updatedUser});
});

module.exports=Route;

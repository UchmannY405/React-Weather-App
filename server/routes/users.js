const express = require("express");
const Route = express.Router();
const bcrypt = require("bcryptjs");
const User = require('../models/User');
const {updateProfileSchema,changePasswordSchema} = require('../validation/authSchemas')
const {validate} = require('../validation/validate');

Route.get('/me',async (req,res)=>{
    const { name } = req.user;

    if(!name)
    {
      throw new Error('Unauthorized user')
    }

    res.status(200).json({msg:`Welcome ${name}!`});
})

Route.patch("/me",validate(updateProfileSchema),async (req, res) => {
  const { userID } = req.user;

  if (!userID) {
    throw new Error("Unauthorized user");
  }

  const user = await User.findByIdAndUpdate({_id:userID},req.body,{new:true});

  if (!user)
  {
    throw new Error('User Not found');
  }

  res.status(200).json({user});


});

Route.patch("/me/password",validate(changePasswordSchema),async (req, res) => {
  const {userID} = req.user;

  const {currentPassword, newPassword} = req.body;

  if (!userID) {
     throw new Error("Unauthorized user");
  };

  const user = await User.findById(userID);

  if (!user) {
     throw new Error("User not found");
  }

  const isCorrectPassword = user.verifyPassword(currentPassword,user.password);

  if(!isCorrectPassword)
  {
    throw new Error('Incorrect credentials')
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(newPassword, salt);

  const updatedUser = await User.findByIdAndUpdate({_id:userID},{password},{new:true})

  res.status(201).json({updatedUser});
});

module.exports=Route;

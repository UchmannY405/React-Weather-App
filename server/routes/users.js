const express = require("express");
const Route = express.Router();
const {updateProfileSchema,changePasswordSchema} = require('../validation/authSchemas')
const {validate} = require('../validation/validate');

Route.get('/me',async (req,res)=>{
    res.send('Read User Profile')
})

Route.patch("/me",validate(updateProfileSchema),async (req, res) => {
  res.send("Update User Profile");
});

Route.patch("/me/password",validate(changePasswordSchema),async (req, res) => {
  res.send("Update User Password");
});

module.exports=Route;

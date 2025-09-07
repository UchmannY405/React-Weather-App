const express = require('express');
const {loginSchema,registerSchema}= require('../validation/authSchemas');
const {validate}= require('../validation/validate');


const Route = express.Router();

Route.post('/register',validate(registerSchema),async (req,res)=>{

    res.status(200).json({msg:'Register Route'});
})


Route.post("/login", validate(loginSchema),async(req, res) => {
  
  res.status(200).json({ msg: "Login Route" });
});

Route.get("/me",dashAuth,(req, res) => {
  res.status(200).json({ msg: "Who Am I Route" }); //used to fetch user during initial appload
});

module.exports=Route;
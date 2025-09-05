require('dotenv').config();
const connectDB = require('../db/connect');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5050
const startServer = async ()=>{
    try
    {
        await connectDB();
        app.listen(PORT, () => {
          console.log(`Server listening at port ${PORT}`);
        });
    }
    catch(err)
    {
        console.log(err)
    }
}
startServer();

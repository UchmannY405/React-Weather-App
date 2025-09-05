require('dotenv').config();
const connectDB = require('../db/connect');
const express = require('express');
const app = express();
const notFound = require('../middleware/notFound');
const PORT = process.env.PORT || 5050
app.use(notFound);
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

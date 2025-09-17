require('dotenv').config();
require('express-async-errors');
const connectDB = require('../db/connect');
const express = require('express');
const cors = require('cors');
const app = express();
const authRoute = require('../routes/auth')
const userRoute = require('../routes/users')
const notFound = require('../middleware/notFound');
const dashAuth = require('../middleware/dashAuth')
const errorHandlerMiddleware = require('../middleware/error-handler')

const PORT = process.env.PORT || 5050

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use('/api/v1/auth',authRoute);
app.use('/api/v1/users',dashAuth,userRoute);
app.use(notFound);
app.use(errorHandlerMiddleware);


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

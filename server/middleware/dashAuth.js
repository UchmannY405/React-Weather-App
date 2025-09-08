const JWT = require('jsonwebtoken');

const dashAuth = (req,res,next)=>{
    const { authorization } = req.headers;
    
    if(!authorization || !authorization.startsWith('Bearer'))
    {
        throw new Error('Incorrect token provided')
    }

    const token = authorization.split(' ')[1];
    
    try
    {
        const payload = JWT.verify(token,process.env.JWT_SECRET);
        req.user = {userID:payload.userID, name: payload.name};
        next();
    }
    catch(err)
    {
        throw new Error('Unauthenticated request')
    }
}

module.exports = dashAuth ;

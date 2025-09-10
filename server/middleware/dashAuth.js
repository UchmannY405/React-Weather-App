const JWT = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors/customAPIError');

const dashAuth = (req,res,next)=>{
    const { authorization } = req.headers;
    
    if(!authorization || !authorization.startsWith('Bearer'))
    {
        throw new UnauthenticatedError('Authorization token missing','AUTH_REQUIRED')
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
        throw new UnauthenticatedError('Invalid or expired token','AUTH_INVALID_TOKEN')
    }
}

module.exports = dashAuth ;

const jwt = require('jsonwebtoken');
const JWT_SECRET = "ecgjhges#35$jgf";

const fatchuser=(req,res,next)=>{
    try {
        //Get the user from the jwt token and add to req object
        const token = req.header('auth-token');
        if(!token){
            return res.status(401).json({success: false, msg:"Invalid Token"});
        }
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.id;
        next();
    } catch (error) {
        return res.status(500).json({success : false, msg:"Internan Server Error"});
    }
}

module.exports = fatchuser;
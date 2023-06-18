const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/Users');
const fatchuser = require('../middleware/fatchuser');
const router = express.Router();

const JWT_SECRET = "ecgjhges#35$jgf";

// router.post('/abc',(req,res)=>{
//     res.send("hello")
// })

// Route 1 : Create a user using : POST "/api/auth/createuser". Doesn't require Auth
router.post('/createuser', async (req, res) => {

    try {
        const { name, email, phone, password } = req.body;

        // Check whether the user with this email exists already
        let user = await User.findOne({ email: email });
        let user2 = await User.findOne({ phone: phone });
        if (user || user2) {
            return res.status(400).json({ success: false, msg: "Sorry a user with this email or phone already exists" });
        }

        let salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);
        //Create a new user
        user = await User.create({
            name: name,
            email: email,
            phone: phone,
            password: newPassword
        });
        // Provide token 
        let data = {
            id: user._id
        }
        const authToken = await jwt.sign(data, JWT_SECRET);
        return res.status(200).json({ success: true, authToken });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }

})

// Route 2 : Login a user using : POST "/api/auth/login". Doesn't require Auth
router.post('/login', async (req, res) => {
    try {
        // const {email, password} = req.body;
        const email = req.body.email;
        const password = req.body.password;
        // Find user details 
        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ success: false, msg: "Invalid credential!" });
        }
        // Password verify 
        if (user) {
            const passverify = await bcrypt.compare(password, user.password);
            if (passverify) {
                let data = {
                    id: user._id
                }
                // Provide token 
                const authToken = await jwt.sign(data, JWT_SECRET);
                return res.status(200).json({ success: true, authToken });
            } else {
                return res.status(401).json({ success: false, msg: "Invalid credential!" });
            }
        }
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})

// Route 3 : Get user details using : GET "/api/auth/user". Required Auth
router.get('/user', fatchuser, async (req, res) => {
    try {
        const id = req.user;
        if(!id){
            return res.status(401).json({success: false, msg: "Invalid token"});
        }
        const user = await User.findById(id).select('-password');
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})

// Route 4 : Change password using : PUT "/api/auth/changepassword". Required Auth
router.put('/changepassword', fatchuser, async (req, res)=>{
    try {
        const {oldPassword, newPassword} = req.body;
        const id = req.user;
        if(!id){
            return res.status(401).json({success: false, msg: "Invalid token"});
        }
        const user = await User.findById(id);
        const passverify = await bcrypt.compare(oldPassword, user.password);
        if(passverify){
            const salt = await bcrypt.genSalt(10);
            const hashPass = await bcrypt.hash(newPassword, salt);
            const user2 = await User.findByIdAndUpdate(id, {password: hashPass}, {new: true});
            return res.status(200).json({success: true, user: user2});
        }else{
            return res.status(401).json({success: false, msg: "Wrong Password"});
        }
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})

// Route 5 : Forgot password using : PUT "/api/auth/forgotpassword". Required Auth
// ToDo 

module.exports = router
const express = require('express');
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fatchuser = require('../middleware/fatchuser');
const Images = require('../model/Images');
const router = express.Router();

// Route 1 : Upload image using : POST "/api/image/upload". Required Auth
router.post('/upload', fatchuser, async (req, res) => {
    try {
        const id = req.user;
        const image = req.body;

        const obj = {
            img: {
              data: fs.readFileSync(
                path.join(__dirname + "/uploads/" + req.file.filename)
              ),
              contentType: "image/png",
            },
          };
          const newImage = new ImageModel({
            image: obj.img,
          });
          newImage.save((err) => {
            err ? console.log(err) : res.redirect("/");
          });

        

    } catch (error) {
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})

module.exports = router
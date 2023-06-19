const express = require('express');
const fs = require("fs");
const formidable = require('formidable')
const fatchuser = require('../middleware/fatchuser');
const Images = require('../model/Images');
const router = express.Router();

// Route 1 : Upload image using : POST "/api/image/upload". Required Auth
router.post('/upload', fatchuser, async (req, res) => {
  try {
    const id = req.user;
    if (!id) {
      return res.status(401).json({ success: false, msg: "Invalid token" });
    }

    const form = new formidable.IncomingForm()
    await form.parse(req, async (err, fields, file) => {
      if (err) {
        return res.status(500).json({ success: false, msg: "Internal Server Error" })
      }
      console.log("fields : ", fields)
      console.log("files : ", file.image.size)
      if (file.image.size > 10485760) { // >10 mb
        return res.status(400).json({ success: false, msg: "file is too big" });
      }
      // Upload Image 
      if (file.image) {
        const image = await Images.create({
          user: id,
          image: {
            data: fs.readFileSync(file.image.filepath),
            contentType: file.image.mimetype
          },
          url: "https://localhost:5000/" + file.image.newFilename,
          size: file.image.size
        })
        if (image) {
          return res.status(200).json({ success: true, image });
        } else {
          return res.status(500).json({ success: false, msg: "Internal Server Error" });
        }
      }
    })

  } catch (error) {
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

// Route 1 : Upload image using : POST "/api/image/upload". Required Auth

module.exports = router
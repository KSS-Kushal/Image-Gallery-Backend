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
      // console.log("fields : ", fields)
      // console.log("files : ", file)
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
          fileName: file.image.newFilename,
          url: "http://localhost:5000/api/image/" + file.image.newFilename,
          size: file.image.size,
          tag: fields.tag ? fields.tag :''
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

// Route 2 : Delete an image using : DELETE "/api/image/delete/:id". Required Auth
router.delete('/delete/:id', fatchuser, async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) {
      return res.status(401).json({ success: false, msg: "Invaild token" });
    }
    // Delete the Image
    const image = await Images.findByIdAndDelete(req.params.id).select('-image');
    if (image) {
      return res.status(200).json({ success: true, image });
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

// Route 3 : Fetch all images using : GET "/api/image/images". Required Auth
router.get('/images', fatchuser, async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) {
      return res.status(401).json({ success: false, msg: "Invaild token" });
    }
    // Fetch Images 
    const images = await Images.find({ user: userId }).select('-image');
    if (images) {
      return res.status(200).json({ success: true, images });
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});



// Route 4 : Search images using : GET "/api/image/images/:tag". Required Auth
router.get('/images/:tag', fatchuser, async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) {
      return res.status(401).json({ success: false, msg: "Invaild token" });
    }
    const images = await Images.find({ user: userId, tag: req.params.tag });
    if (images) {
      return res.status(200).json({ success: true, images });
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
})



// Route 5 : Get an images using : GET "/api/image/:id". Doesn't require Auth
router.get('/:id', async (req, res) => {
  try {
    // const userId = req.user;
    // if (!userId) {
    //   return res.status(401).json({ success: false, msg: "Invaild token" });
    // }
    const images = await Images.findOne({ fileName: req.params.id });
    if (images) {
      res.set("Content-Type", images.image.contentType)
      return res.status(200).send(images.image.data);
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
})

module.exports = router
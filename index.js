const express = require('express')
const bodyParser = require("body-parser");
const multer = require("multer");
const app = express()
const port = 5000

const cors = require('cors')
const connectToMongo = require('./db')
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

connectToMongo();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });


app.get("/", (req, res) => {
  ImageModel.find({}, (err, images) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.render("index", { images: images });
    }
  });
});


app.use('/api/auth', require("./routes/auth"));
app.use('/api/image', require('./routes/image'));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
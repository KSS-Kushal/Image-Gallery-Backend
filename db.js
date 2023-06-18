const mongoose = require('mongoose');
const mongoURI ="mongodb://localhost:27017/ImageGallery?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const connectToMongo =()=>{
    mongoose.connect(mongoURI).then(()=>{
        console.log("Connected");
    })
}

module.exports= connectToMongo;
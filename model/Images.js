const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    url: {
        type: String
    },
    tag: {
        type: Array
    },
    date: {
        type: String,
        default: Date.now
    }
});
const image = mongoose.model('image', imageSchema);
image.createIndexes();
module.exports = image;
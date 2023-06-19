const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String,
    },
    url: {
        type: String
    },
    size: {
        type: Number
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
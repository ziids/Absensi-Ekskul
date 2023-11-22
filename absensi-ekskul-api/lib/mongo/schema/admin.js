const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    type: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
    }
});

module.exports = mongoose.model("admin", adminSchema);
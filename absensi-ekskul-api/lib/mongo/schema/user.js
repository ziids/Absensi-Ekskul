const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    photo: {
        type: String,
        required: true,
    },
    nis: {
        type: String,
        required: true,
    },
    nama: {
        type: String,
        required: true,
    },
    kelas: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    absensi: {
        type: Boolean,
        required: true,
    },
    information: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    reset: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("user", userSchema);
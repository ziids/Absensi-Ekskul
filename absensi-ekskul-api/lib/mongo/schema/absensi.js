const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addAbsensiSchema = new Schema({
    nis: {
        type: String,
        require: true
    },
    nama: {
        type: String,
        require: true
    },
    kelas: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    }
});

const absenSchema = new Schema({
    date: {
        type: String,
        required: true,
    },
    expired: {
        type: String,
        require: true
    },
    getDay: {
        type: String,
        require: true
    },
    getDate: {
        type: String,
        require: true
    },
    getMonthInt: {
        type: String,
        require: true
    },
    getMonthStr: {
        type: String,
        require: true
    },
    getYear: {
        type: String,
        require: true
    },
    absen: [ addAbsensiSchema ],
    izin: [ addAbsensiSchema ]
});

module.exports = mongoose.model("absen", absenSchema);
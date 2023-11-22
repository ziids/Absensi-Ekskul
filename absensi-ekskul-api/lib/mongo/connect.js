const mongoose = require("mongoose");

const mongoConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("[!] Absensi Ekskul Database has been Connected!");
    } catch (error) {
        console.log("[!] Something went wrong with Absensi Ekskul Database Connection");
        console.log(error);
        process.exit(1);
    }
};

module.exports = mongoConnect;
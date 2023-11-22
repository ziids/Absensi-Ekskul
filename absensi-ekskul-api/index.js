const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const moment = require("moment-timezone");
require('dotenv').config();

const dataSiswa = require('./data/siswa.json');
const dataKelas = require('./data/kelas.json');

app.use(cors());
app.use(require('body-parser').urlencoded({ limit: '50mb', extended: true }));
app.use(require('body-parser').json({ limit: '50mb' }));

const mongoConnect = require('./lib/mongo/connect');
mongoConnect();

const userSchema = require('./lib/mongo/schema/user');
const adminSchema = require('./lib/mongo/schema/admin');
const absensiSchema = require('./lib/mongo/schema/absensi');

const generateRandomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const generateRandomTokenAbsen = (length) => {
    let result = '';    
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

// SETIAP 15 MENIT GANTI TOKEN
setInterval(async() => {
    try {
        let newToken = generateRandomTokenAbsen(5);
        await adminSchema.findOneAndUpdate({}, { $set: { 'token': newToken } }, { new: true });
    } catch (e) {
        console.log(e);
    }
}, 15 * 60 * 1000);

// SETIAP JAM 12 MALAM MEMATIKAN DAN MENYALAKAN DI JAM 01 MALAM 
setInterval(async() => {
    try {
        if ( moment().tz("Asia/Jakarta").format("HH:mm:ss") == "00:00:00" ) {
            await adminSchema.findOneAndUpdate({}, { $set: { 'isActive': false } }, { new: true });
            await userSchema.updateMany({ absensi: true }, { $set: { absensi: false } });
        } else if ( moment().tz("Asia/Jakarta").format("HH:mm:ss") == "01:00:00" ) {
            let getDay = date.toLocaleDateString("id-id", { "weekday" : "long" });
            let getDate = date.toLocaleDateString("id-id", { "day" : "numeric" });
            let getMonthStr = date.toLocaleDateString("id-id", { "month" : "long" });
            let getMonthInt = date.toLocaleDateString("id-id", { "month" : "numeric" });
            let getYear = date.toLocaleDateString("id-id", { "year" : "numeric" });
            
            let current = date.toLocaleDateString("id-id", { day: '2-digit', month: '2-digit', year: 'numeric' });
            date.setDate(date.getDate() + 1);
            let expired = date.toLocaleDateString("id-id", { day: '2-digit', month: '2-digit', year: 'numeric' });
    
            let absensi = new absensiSchema({
                date: current,
                expired: expired,
                getDay: getDay,
                getDate: getDate,
                getMonthStr: getMonthStr,
                getMonthInt: getMonthInt,
                getYear: getYear,
                absen: []
            });
            await absensi.save();
            await adminSchema.findOneAndUpdate({}, { $set: { 'isActive': true } }, { new: true });
        }
    } catch (e) {
        console.log(e);
    }
}, 1000);

// SIGN UP
app.post('/api/signup', async (req, res) => {
    let { nis, nama, kelas, type, email, password } = req.body;
    if (!(nis && nama && kelas && type && email && password)) return res.json({ 'message': 'incomplete data!' });

    let checkingNis = await userSchema.find({ nis: nis });
    let checkingEmail = await userSchema.find({ nis: email });
    if (checkingNis.length > 0 || checkingEmail.length > 0) return res.json({ 'message': 'email or nis already registered!' });

    const hashpw = await bcrypt.hash(password, 12);
    
    try {
        let user = new userSchema({
            photo: "https://uploads-ssl.webflow.com/609590760a2535564b46ade4/62bc1dd61de66608d84ee823_profile-4.png",
            nis: nis,
            nama: nama,
            kelas: kelas,
            email: email,
            password: hashpw,
            type: type,
            information: { "hadir": 0, "izin": 0, "alpha": 0 },
            token: generateRandomString(50),
            absensi: false,
            reset: generateRandomTokenAbsen(6)
        });
        await user.save();

        res.json({ 'message': 'successfully!' });
    } catch (e) {
        console.log(e);
        res.json({ 'message': 'unknown error!' });
    }
});

// SIGN IN
app.post('/api/signin', async (req, res) => {
    let { nis, password } = req.body;
    if (!(nis && password)) return res.json({ 'message': 'incomplete data!' });

    try {
        let checkingNis = await userSchema.find({ nis: nis });
        if (checkingNis.length <= 0) return res.json({ 'message': 'nis not registered!' });
        checkingNis.find(async (user) => {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.json({ 'message': 'password does not match!' })
            } else {
                res.json({ 'message': 'successfully!', 'token': user.token });
            }
        });
    } catch (e) {
        console.log(e);
        res.json({ 'message': 'unknown error!' });
    }
});

// TOKEN
app.post('/api/token', async (req, res) => {
    const { token } = req.body;
    if (!token) return res.json({ 'messagge': 'incomplete data!' });

    try {
        let checkingToken = await userSchema.find({ token: token });
        if (checkingToken.length <= 0) return res.json({ 'message': 'nis not registered!' });
        
        if (checkingToken.find((user) => { 
            res.json({ 'message': 'successfully!', 'photo': user.photo, 'nis': user.nis, 'nama': user.nama, 'kelas': user.kelas, 'email': user.email, 'information': user.information, 'type': user.type, 'absensi': user.absensi })
        }));
    } catch (e) {
        res.json({ 'message': 'unknown error!' });
    }
});

// ABSEN FORM
app.post('/api/absen/user', async (req, res) => {
    const { tokenId, keterangan, tokenAbsen } = req.body;
    if (!(tokenId && keterangan)) return res.json({ 'message': 'incomplete data!' });
    try {
        let checkingToken = await userSchema.findOne({ token: tokenId });
        if (!checkingToken) return res.json({ 'message': 'nis not registered!' });

        let checkingAbsen = await adminSchema.find({});
        if (!(checkingAbsen[0]).isActive) return res.json({ 'message': 'attendance is not available!' });

        let date = new Date();
        let current = date.toLocaleDateString("id-id", { day: '2-digit', month: '2-digit', year: 'numeric' });

        if (keterangan === "hadir") {
            if (!(tokenAbsen)) return res.json({ 'message': 'incomplete data!' });
            if (!(tokenAbsen === checkingAbsen[0].token)) return res.json({ 'message': 'invalid attendance token!' });

            const dataAbsen = {
                nis: checkingToken.nis, 
                nama: checkingToken.nama,
                kelas: checkingToken.kelas,
                type: checkingToken.type
            }

            let check = await absensiSchema.findOne({ date: current });

            if (check) {
                for (let i = 0; i < check.absen.length; i++) {
                    if (check.absen[i].nis === checkingToken.nis) {
                        return res.json({ 'message': "You've taken attendance!" });
                    }
                }
                
                await absensiSchema.findOneAndUpdate({ date: current }, { $push: { absen: dataAbsen } });
                await userSchema.findOneAndUpdate({ token: tokenId }, { $set: { 'information.hadir': checkingToken.information.hadir + 1 } }, { new: true } );
                await userSchema.findOneAndUpdate({ token: tokenId }, { $set: { 'absensi': true }});
                res.json({ 'message': 'successfully!' });
            } else {
                res.json({ 'message': 'attendance is not available!' });
            }
        } else if (keterangan === "izin") {
            const dataAbsen = {
                nis: checkingToken.nis, 
                nama: checkingToken.nama,
                kelas: checkingToken.kelas,
                type: checkingToken.type
            }

            let check = await absensiSchema.findOne({ date: current });

            if (check) {
                for (let i = 0; i < check.absen.length; i++) {
                    if (check.absen[i].nis === checkingToken.nis) {
                        return res.json({ 'message': "You've taken attendance!" });
                    }
                }

                await absensiSchema.findOneAndUpdate({ date: current }, { $push: { izin: dataAbsen } });
                await userSchema.findOneAndUpdate({ token: tokenId }, { $set: { 'information.izin': checkingToken.information.izin + 1 } }, { new: true } );
                await userSchema.findOneAndUpdate({ token: tokenId }, { $set: { 'absensi': true }});
                res.json({ 'message': 'successfully!' });
            } else {
                res.json({ 'message': 'attendance is not available!' });
            }
        }
    } catch (e) {
        console.log(e);
        res.json({ 'message': 'unknown error!' });
    }
});

// PROFILE UPDATE
app.post('/api/profile/update', async (req, res) => {
    const { email, photo, token } = req.body;
    if (!(token)) return res.json({ 'message': 'incomplete data!' });
    if (!(email || photo)) return res.json({ 'message': 'please change it first!' });
    try {
        let checkingToken = await userSchema.find({ token: token });
        if (checkingToken.length <= 0) return res.json({ 'message': 'nis not registered!' });
        if (email) await userSchema.findOneAndUpdate({ token: token }, { $set: { 'email': email } }, { new: true } );
        if (photo) await userSchema.findOneAndUpdate({ token: token }, { $set: { 'photo': photo } }, { new: true } );
        res.json({ 'message': 'successfully!' });
    } catch (e) {
        console.log(e);
        res.json({ 'message': 'unknown error!' });
    }
});

// API KELAS (DATA)
app.get('/api/kelas', async (req, res) => {
    let result = "<option selected disabled value>--- Silahkan Pilih ---</option>";
    for (let kelas of dataKelas) {
        result += `<option value="${kelas}">${kelas}</option>`;
    }
    res.send(result);
});

// API NIS (DATA)
app.get('/api/nis', async (req, res) => {
    const { kelas } = req.query;
    let result = "<option selected disabled value>--- Silahkan Pilih Kelas ---</option>";
    if (!(kelas)) return res.send('<option selected disabled value>--- Silahkan Pilih Kelas ---</option>');
    try {
        const json = dataSiswa.filter(item => item.kelas === kelas);
        for (let data of json) {
            result += `<option value="${data.nis}">${data.nis}</option>`;
        }
        res.send(result);
    } catch(e) {
        console.log(e);
        res.send('<option selected disabled value>--- Error ---</option>');
    }
});

// API NAMA (DATA)
app.get('/api/nama', async (req, res) => {
    const { nis } = req.query;
    let result = "--- Silahkan Pilih NIS ---";
    if (!(nis)) return res.send('--- Silahkan Pilih NIS ---');
    try {
        const json = dataSiswa.find(el => el.nis === nis);
        result = json.nama;
        res.send(result);
    } catch(e) {
        console.log(e);
        res.send('<option selected disabled value>--- Error ---</option>');
    }
});

// RESET PASSWORD
app.post('/api/password/reset', async (req, res) => {
    const { email, newPassword, tokenReset } = req.body;
    if (!(newPassword && tokenReset)) return res.json({ 'message': 'incomplete data!' });
    try {
        let checkingEmail = await userSchema.findOne({ email: email });
        if (!checkingEmail) return res.json({ 'message': 'email not registered!' });

        const hashpw = await bcrypt.hash(newPassword, 12);

        await userSchema.findOneAndUpdate({ email: email }, { $set: { 'reset': generateRandomTokenAbsen(6) } }, { new: true });
        await userSchema.findOneAndUpdate({ email: email }, { $set: { 'password': hashpw } }, { new: true });

        res.json({ 'message': 'successfully!' });
    } catch (e) {
        console.log(e);
        res.json({ 'message': 'unknown error!' });
    }
});

// CHECK EMAIL RESET PASSWORD
app.post('/api/password/token', async (req, res) => {
    const { email, token } = req.body;
    if (!(email || token)) return res.json({ 'message': 'incomplete data!' });

    try {
        let checkingEmail = await userSchema.findOne({ email: email });
        if (!checkingEmail) return res.json({ 'message': 'email not registered!' });
        if (!(checkingEmail.reset === token)) return res.json({ 'message': 'token not found!' });
        res.json({ 'message': 'successfully!' });
    } catch (e) {
        console.log(e);
        res.json({ 'message': 'unknown error!' });
    }
});

// SEND EMAIL TOKEN
app.post('/api/password/send', async (req, res) => {
    const { email } = req.body;
    if (!(email)) return res.json({ 'message': 'incomplete data!' });
    try {
        let checkingEmail = await userSchema.findOne({ email: email });
        if (!checkingEmail) return res.json({ 'message': 'email not registered!' });

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        var mailOptions = {
            from: "Absensi Ekskul",
            to: email,
            subject: 'Reset Password Verification',
            html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Absensi Ekskul</title><style>@import url(https://fonts.googleapis.com/css2?family=Open+Sans&display=swap);*{margin:0;padding:0;font-family:'Open Sans'}</style></head><body><div style="width:100%;height:100vh"><div style="background-color:#3a56e7;border-radius:0 0 20px 20px;padding:40px"><div style="text-align:center"><img style="width:100px;height:100px" src="https://media.discordapp.net/attachments/1033742442094149752/1152424164909654056/20230916_090103.png" alt="logo"></div><div style="text-align:center;color:#fff"><h3 style="font-size:1.5rem">Absensi Ekskul</h3><p>RESET PASSWORD</p></div></div><div style="padding:30px;color:#000"><p style="margin-bottom:20px"><span style="font-weight:700">Date : </span>${((new Date()).getDate()).toString().padStart(2, "0")} ${(new Date()).toLocaleString('default', { month: 'long' })} ${(new Date()).getFullYear()}</p><div><p style="padding-top:4px;padding-bottom:4px">Halo <span style="font-weight:700">${checkingEmail.nama}</span>,</p><p style="padding-top:4px;padding-bottom:4px">Seorang mencoba mengganti password akun Ekskul Anda</p><p style="padding-top:4px;padding-bottom:4px"></p>Jika ini Anda, harap gunakan kode berikut untuk mengonfirmasi identitas anda</p><h3 style="padding-top:10px;padding-bottom:10px;font-size:2rem;text-align:center">${checkingEmail.reset}</h3><p style="padding-top:4px;padding-bottom:4px">Jika ini bukan Anda, abaikan saja email ini.</p></div></div><div style="background-color:#3a56e7;padding:20px;text-align:center;color:#fff"><p>Copyright 2023 © Absensi Ekskul</p></div></div></body></html>`
        };
        
        transporter.sendMail(mailOptions, function(e, info){
            if (e) {
                console.log(e);
                res.json({ 'message': 'unknown error!' });
            } else {
                res.json({ 'message': 'successfully!' });
            }
        });
    } catch (e) {
        console.log(e);
        res.json({ 'message': 'unknown error!' });
    }
});

// ADMIN LOGIN
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    if (!(username || password)) return res.json({ 'message': 'incomplete data!' });
    try {
        if (username !== process.env.ADMIN_USERNAME) return res.json({ 'message': 'invalid username!' });
        if (password !== process.env.ADMIN_PASSWORD) return res.json({ 'message': 'invalid password!' });
        if (username == process.env.ADMIN_USERNAME && password == process.env.ADMIN_PASSWORD) return res.json({ 'message': 'successfully!', 'token': process.env.ADMIN_TOKEN });
    } catch (e) {
        console.log(e);
        res.json({ 'message': 'unknown error!' });
    }
});

// USER (ADMIN)
app.post('/api/admin/user', async (req, res) => {
    const { search, token } = req.body;
    if (!(token)) return res.json({ 'message': 'incomplete data!' });
    try {
        let find;
        if (token !== process.env.ADMIN_TOKEN) return res.json({ 'message': "you're not an admin!" });
        if (search == "") find = await userSchema.find({});
        else find = await userSchema.find({ $or: [{ nis: search }, { nama: search }, { kelas: search }]});
        res.json(find);
    } catch(e) {
        console.log(e);
        res.json({ 'message': 'unknown error!' });
    }
});

// app.post('/api/admin/date',)

app.post('/api/admin/date', async (req, res) => {
    const { search, token } = req.body;
    if (!(token)) return res.json({ 'message': 'incomplete data!' });
    if (token !== process.env.ADMIN_TOKEN) return res.json({ 'message': "you're not an admin!" });
    try {
        let find;
        if (search == "") {
            find = await absensiSchema.find({});
        } else {
            find = await absensiSchema.find({ $or: [{ getDay: search }, { getDate: search }, { getMonthInt: search }, { getMonthStr: search }, { getYear: search }, { date: search } ]});
        }
        res.json(find);
    } catch(e) {
        console.log(e);
        res.json({ 'message': 'unknown error!' });
    }
});

// CHECK KONDISI KEHADIRAN 
app.post('/api/admin/absen/check', async (req, res) => {
    const { token } = req.body;
    if (!(token)) return res.json({ 'message': 'incomplete data!' });
    if (token !== process.env.ADMIN_TOKEN) return res.json({ 'message': "you're not an admin!" });
    try {
        let admin = await adminSchema.findOne({});
        if (!admin.isActive) return res.json({ 'message': 'attendance is not available!' });
        if (admin.isActive) return res.json({ 'message': 'successfully!', 'token': admin.token });
    } catch (e) {
        console.log(e);
        res.json({ 'message': 'unknown error!' });
    }
});

// BUAT KONDISI KEHADIRAN
app.post('/api/admin/absen/on', async (req, res) => {
    const { token } = req.body;
    if (!(token)) return res.json({ 'message': 'incomplete data!' });
    const date = new Date();
    try {
        if (token !== process.env.ADMIN_TOKEN) return res.json({ 'message': "you're not an admin!" });

        let getDay = date.toLocaleDateString("id-id", { "weekday" : "long" });
        let getDate = date.toLocaleDateString("id-id", { "day" : "numeric" });
        let getMonthStr = date.toLocaleDateString("id-id", { "month" : "long" });
        let getMonthInt = date.toLocaleDateString("id-id", { "month" : "numeric" });
        let getYear = date.toLocaleDateString("id-id", { "year" : "numeric" });
        
        let current = date.toLocaleDateString("id-id", { day: '2-digit', month: '2-digit', year: 'numeric' });
        date.setDate(date.getDate() + 1);
        let expired = date.toLocaleDateString("id-id", { day: '2-digit', month: '2-digit', year: 'numeric' });
        
        let abs =  await adminSchema.findOne({});
        if (!abs.isActive) {
            let antiDupe = await absensiSchema.findOne({ date: current.toString() });
            if (!antiDupe) {
                let absensi = new absensiSchema({
                    date: current,
                    expired: expired,
                    getDay: getDay,
                    getDate: getDate,
                    getMonthStr: getMonthStr,
                    getMonthInt: getMonthInt,
                    getYear: getYear,
                    absen: []
                });
                await absensi.save();
            }
            await adminSchema.findOneAndUpdate({}, { $set: { 'isActive': true } }, { new: true });

            res.json({ 'message': 'successfully!' });
        } else {
            res.json({ 'message': "today's attendance has been made!" })
        }
    } catch (e) {
        console.log(e);
        res.json({ 'message': 'unknown error!' });
    }
});

app.post('/api/admin/absen/off', async (req, res) => {
    const { token } = req.body;
    if (!(token)) return res.json({ 'message': 'incomplete data!' });
    if (token !== process.env.ADMIN_TOKEN) return res.json({ 'message': "you're not an admin!" });
    try {
        let abs =  await adminSchema.findOne({});
        if (abs.isActive) {
            await adminSchema.findOneAndUpdate({}, { $set: { 'isActive': false } }, { new: true });
            await userSchema.updateMany({ absensi: true }, { $set: { absensi: false } });
            res.json({ 'message': 'successfully!' });
        } else {
            res.json({ 'message': "attendance has been deactivated!" });
        }
    } catch (e) {
        console.log(e);
        res.json({ 'message': 'unknown error!' });
    }
});

app.post('/api/admin/absen/reset', async (req, res) => {
    const { token } = req.body;
    if (!(token)) return res.json({ 'message': 'incomplete data!' });
    if (token !== process.env.ADMIN_TOKEN) return res.json({ 'message': "you're not an admin!" });
    try {
        let newToken = generateRandomTokenAbsen(5);
        await adminSchema.findOneAndUpdate({}, { $set: { 'token': newToken } }, { new: true });
        res.json({ 'message': 'successfully!' });
    } catch (e) {
        console.log(e);
        res.json({ 'message': 'unknown error!' });
    }
});

app.post('/api/admin/absen/chart', async (req, res) => {
    const { token } = req.body;
    if (!(token)) return res.json({ 'message': 'incomplete data!' });
    if (token !== process.env.ADMIN_TOKEN) return res.json({ 'message': "you're not an admin!" });
    try {
        let items = await absensiSchema.find({});
        let alluser = await userSchema.find({});
        let result = [];
        let dates = [];

        items.forEach((item) => {
            let data = {
                date: item.date,
                absen: item.absen.length,
                izin: item.izin.length,
                alpha: alluser.length - (item.absen.length + item.izin.length)
            }
            dates.push(item.date);
            if (result.length <= 5) result.push(data); else if (result.length < 5) return true;
        });

        res.json({
            'message': 'successfully!',
            'data': result,
            'dates': dates
        });
    } catch (e) {
        console.log(e);
        res.json({ 'message': 'unknown error!' });
    }
});

app.listen(12345, () => {
    console.log('[!] Absensi Ekskul Database has been Online!');
});
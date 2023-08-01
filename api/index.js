const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Pet = require('./models/Pet.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');

require('dotenv').config()
const app = express();

const salt = bcrypt.genSaltSync(10);
const jwtSecret = 'cjkafbawefbaucncawienfvooaojw';


app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));


mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) => {
    res.json('test bechimcut');
});

app.post('/register', async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({email});
    if (userDoc) {
        // res.json('found');
        const passwordOk = bcrypt.compareSync(password, userDoc.password)
        if (passwordOk) {
            jwt.sign({
                email:userDoc.email,
                id:userDoc._id,

            }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            });
        } else {
            res.status(422).json('password incorrect');
        }
    } else {
        res.json('not found');
    }
});


app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if(err) throw err;
            const {name, email, _id} = await User.findById(userData.id)
            res.json({name, email, _id});
        });
    } else {
        res.json(null);
    }
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

// console.log({__dirname });
app.post('/upload-by-link', async (req,res) => {
    const {link} = req.body;
    const newName = 'img' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName);
})

const photoMiddleware = multer({dest:'uploads/'});
app.post('/upload', photoMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {

        const {path, originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;

        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads/',''));
    }
    res.json(uploadedFiles);

});

app.post('/pets', (req,res) => {
    const {token} = req.cookies;
    const {
        name, address, addedPhoto, desc,
        type, availableFor, gender, interestedGender,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const petDoc = await Pet.create({
            owner: userData.id,
            name, address, photos:addedPhoto, desc,
            type, availableFor, gender, interestedGender
        })
        res.json(petDoc)
    })
})

app.get('/pets', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const {id} = userData;
        res.json(await Pet.find({owner:id}));
    })
})

app.get('/pets/:id', async (req,res) => {
    const {id} = req.params;
    res.json(await Pet.findById(id));
})

app.put('/pets', async(req,res) => {
    const {token} = req.cookies;
    const {
        id, name, address, addedPhoto, desc,
        type, availableFor, gender, interestedGender,
    } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const petDoc = await Pet.findById(id);
        if(userData.id === petDoc.owner.toString()) {
            petDoc.set({
                name, address, photos:addedPhoto, desc,
                type, availableFor, gender, interestedGender
            })
           await petDoc.save();
           res.json('ok');
        }
    })
})

app.get('/match-pets', async (req, res) => {
    const { type, gender, availableFor, interestedGender } = req.query;
    const { token } = req.cookies;


    try {
        const userData = jwt.verify(token, jwtSecret);
        const { id } = userData;

        const matchedPets = await Pet.find({
            owner: { $ne: id },
            type,
            gender: interestedGender,
            availableFor,
            interestedGender: gender,
            // matches: { $in: [new ObjectId(id)] } // chỗ này e tính là púsh con matched vào array matches
        });
        res.json(matchedPets);
    } catch (error) {
        console.error('Error fetching matched pets:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/match-pets', async (req, res) => {
    const {petId} = req.body;
    const {token} = req.cookies;

    try {
        const userData = jwt.verify(token, jwtSecret);
        // const userId = userData.id;
        const userPet = await Pet.findOne({owner: userData.id});
        const swipedPet = await Pet.findById(petId);

        if (!userPet || !swipedPet) {
            return res.status(404).json({ error: "Pet not found" });
        }

        userPet.matches.push(swipedPet._id);
        swipedPet.matches.push(userPet._id);

        await userPet.save();
        await swipedPet.save();

        res.json({message: 'Match created successfully!'});

    } catch (error) {
        console.error('Error fetching matched pets:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

app.listen(4000);

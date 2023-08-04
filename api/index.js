const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Pet = require('./models/Pet.js');
const Chat = require('./models/Chat.js');
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


app.get('/match-pets/:userPetId', async (req, res) => {
    // const { _id, type, gender, availableFor, interestedGender } = req.query;
    const { token } = req.cookies;
    const { type, gender, availableFor, interestedGender } = req.query;
    const { userPetId } = req.params

    try {
        const userData = jwt.verify(token, jwtSecret);
        const { id } = userData;

        const userPet = await Pet.findById(userPetId)
        const matchedPets = await Pet.find({
            owner: { $ne: id },
            _id: { $not: { $in: userPet.matches } },
            type,
            gender: interestedGender,
            availableFor,
            interestedGender: gender,
        });
        console.log("Potential matches: match-pets ", matchedPets)
        res.json(matchedPets);
        console.log('userPet.matches la gi', userPet.matches)
    } catch (error) {
        console.error('Error fetching matched pets:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/check-match/:userPetId', async (req, res) => {

    const { userPetId } = req.params;

    try {

        if (!userPetId) {
            return res.status(404).json({ error: "User pet not found" });
        }
        const userPet = await Pet.findById(userPetId);

        const swipedRightPets = await Pet.find({
            _id: { $in: userPet.matches },
            matches: userPetId,
        });
        console.log("backend tra ve check-match", swipedRightPets)
        res.json(swipedRightPets);
    } catch (error) {
        console.error('Error fetching matched pets:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/create-match', async (req, res) => {
    const { userPetId, matchedPetId } = req.body;
    const { token } = req.cookies;

    try {
        const userData = jwt.verify(token, jwtSecret);
        const userId = userData.id;

        const userPet = await Pet.findById(userPetId);

        const matchedPet = await Pet.findById(matchedPetId);

        if (!userPet || !matchedPet) {
            return res.status(404).json({ error: "Pet not found" });
        }
        const updatedUserPet = userPet.matches.push(matchedPetId);
        await userPet.save();
        res.json(updatedUserPet);


    } catch (error) {
        console.error('Error creating match:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/matches/:userPetId', async (req, res) => {
    const { token } = req.cookies;
    const { userPetId }  = req.params;

    try {
        const userData = jwt.verify(token, jwtSecret);
        const { id } = userData;
        if (!userPetId) {
            return res.status(404).json({ error: 'User pet not found' });
        }

        const matchedPets = await Pet.find({
            _id: { $in: userPetId.matches },
            matches: userPetId,
            owner: { $ne: id },
        });
        console.log("matchedPets backend", matchedPets)
        res.json(matchedPets);
    } catch (error) {
        console.error('Error fetching matched pets:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/messages', async (req, res) => {
    const { token } = req.cookies;
    const { userPetId, clickedUserPetId } = req.query;
    try {
        const userData = jwt.verify(token, jwtSecret);
        const { id } = userData;
        const userPet = await Pet.findOne({ owner: id });
        if (!userPet) {
            return res.status(404).json({ error: 'User pet not found' });
        }

        const query = {
            from_userId: userPetId, to_userId: clickedUserPetId
        }
        const foundMessages = await Chat.find(query)
        // console.log("foundMsg from API", foundMessages);
        res.send(foundMessages);

    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/message', async (req, res) => {
    const { token } = req.cookies;
    const { from_userId, to_userId, content, timestamp } = req.body;

    try {
        const userData = jwt.verify(token, jwtSecret);
        const userId = userData.id;
        const userPetId = await Pet.findOne({ owner: userId });

        const newMessage = new Chat({
            from_userId,
            to_userId,
            content,
            timestamp,
        });

        await newMessage.save();
        res.send(newMessage);

    } catch (error) {
        console.error('Error sending chat message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/adoption-pets", async (req, res) => {
    const { token } = req.cookies;
    const { availableFor } = req.query;

    try {
        const userData = jwt.verify(token, jwtSecret);
        const { id: userId } = userData;
        const matchedPets = await Pet.find({
            availableFor: availableFor,
            owner: { $ne: userId },
        })
            .select('-matches -createdAt -updatedAt')
            .populate('owner', 'email');
        console.log(matchedPets)
        res.json(matchedPets);
    } catch (error) {
        console.error('Error fetching adoption pets:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(4000);

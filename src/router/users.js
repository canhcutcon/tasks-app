const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const routers = new express.Router();
const User = require('../models/user');
const router = require('./task');
const auth = require('../middleware/auth');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');


//fecthing all user



routers.get('/users/me', auth, async(req, res) => {
    // tim tat ca nguoi dung co trong du lieu
    res.status(201).send(req.user);
    // try {
    //     //const readAlluser = await User.find({});
    // } catch (e) {
    //     res.status(400).send(e);
    // }
});

const upload = multer({
    dest: 'images',
    limits: {
        // gioi han kich thuoc tep
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please jpg, jpeg, png!!'));
        }

        cb(undefined, true);
    }
});

//upload file avatar
routers.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    //const buffer = await sharp(req.file.buffer).resize({ width: 100, height: 100 }).png().toBuffer()
    req.user.avatar = req.file.buffer;
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

routers.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
});

routers.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);

    } catch (e) {
        res.status(404).send();
    }
});

//fecthing user by id params
// routers.get('/users/:id', async(req, res) => {
//     const _id = req.params.id; // lay thong so id sau dau '/'
//     try {
//         const findByID = await User.findById(_id);
//         res.status(201).send(findByID);
//     } catch (e) {
//         res.status(404).send(e);
//     }
// });

routers.post('/users', async(req, res) => {
    const user = new User(req.body)
    try {
        // create toke to sign up
        sendWelcomeEmail(user.email, user.name);
        const token = await user.geneAuthToken();
        await user.save();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }

});

routers.post('/users/login', async(req, res) => {
    try {
        // find user by email and comfirm password to login
        const user = await User.findByIdCredentials(req.body.email, req.body.password);
        // create token to login
        const token = await user.geneAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(404).send(e);
    }
});

// logout 1 user
routers.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.status(201).send();
    } catch (e) {
        res.status(404).send();
    }
})

//logout all user
routers.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(201).send();

    } catch (e) {
        res.status(404).send();
    }
})


// upload user by body
routers.patch('/users/me', auth, async(req, res) => {
    const update = Object.keys(req.body); // lay ten thuoc tinh
    const validator = ['name', 'email', 'password', 'age'];
    const updateValidator = update.every((upload) => validator.includes(upload));

    if (!updateValidator) {
        return res.status(404).send('Invalid update!');
    }
    try {
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        //const user = await User.findById(req.params.id)

        update.forEach((upload) => req.user[upload] = req.body[upload])
        await req.user.save()
            // if (!user) {
            //     return res.status(404).send()
            // }

        res.status(201).send(req.user);
    } catch (e) {
        res.status(400).send(e)
    }
})

//== delete  Resource Deleting Endpoints
routers.delete('/users/me', auth, async(req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.params.id);

        // if (!user) {
        //     return res.status(404).send('No user!!');
        // }
        sendCancelationEmail(req.user.email, req.user.name);
        req.user.remove();
        res.status(200).send(req.user);
    } catch (e) {
        res.status(404).send(e);
    }
})
module.exports = routers;
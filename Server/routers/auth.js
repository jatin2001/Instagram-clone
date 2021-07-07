const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, SENDEREMAIL, DOMAIN } = require("../config/key");
const mailer = require('../config/mailer');
const crypto = require('crypto');
console.log(DOMAIN);
router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) return res.status(422).json({ error: "Enter all fields" });

    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) return res.status(422).json({ error: "User already exists with that email" });
            bcrypt.hash(password, 12)
                .then(hashPassword => {

                    const user = new User({ email, password: hashPassword, name, pic });
                    user.save()
                        .then(user => {
                            const html = `<h1>Thanks ${user.name} for signup in Insta Clone</h1>
                                <a href="${DOMAIN}/verify/${user._id}"> Click Here to Verify</a>
                            `;
                            mailer(SENDEREMAIL, user.email, 'Please Verify Your Email', html);
                            res.json({ message: "Verification Email Sent" });
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })
        })
        .catch(err => {
            console.log(err);
        })

})


router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(422).json({ error: "Please add Email and Password" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid email or Password" });
            }
            if (!savedUser.verified) {
                return res.status(422).json({ error: "Please verify your email to login." });
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // res.json({ message: "succesfully signed in" })
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                        const { _id, name, email, followers, following, pic } = savedUser;
                        res.json({ token, user: { _id, name, email, followers, following, pic } });
                    }
                    else {
                        return res.status(422).json({ error: "Invalid Email or Password" });
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        })
})

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) console.log(err)
        const token = buffer.toString("hex");
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "User dont exists with that email" });
                }
                user.resetToken = token;
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {

                    const html = `
                        <p> ${user.name} you requested for password reset</p>
                        <h5>Click on this <a href="${DOMAIN}/reset/${token}">Link</a></h5>
                        `
                    mailer(SENDEREMAIL, user.email, 'Reset Your Password', html);
                    res.json({ message: "Check your email" });
                })
            })
    })
})

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "try again session expired" });
            }
            bcrypt.hash(newPassword, 12).then(hashedpassword => {
                user.password = hashedpassword;
                user.resetToken = undefined;
                user.expireToken = undefined;
                user.save().then((savedUser) => {
                    res.json({ message: "Password Updated Succesfully" })
                })
            })
        }).catch(err => {
            console.log(err);
        })
})
router.post('/verify', (req, res) => {
    const id = req.body.id;
    console.log(id);
    User.findById(id)
        .then(user => {
            if ((!user)) {
                return res.status(422).json({ error: "try again session expired" });
            }
            user.verified = true;
            user.save().then((savedUser) => {
                res.json({ message: "Verified Successfully" });
            })
        })
})
module.exports = router;
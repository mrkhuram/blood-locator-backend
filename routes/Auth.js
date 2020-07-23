let express = require('express')
let router = express()
let User = require('../models/SignUp')
let bcrypt = require('bcrypt')
let passport = require("../config/passportConfig")


router.post('/user/signup', (req, res) => {

    let data = Object.assign({}, req.body)
    let { name, email, password, phone, blood_group, coordinates } = data
    if (!name || !password || !blood_group ) {
        return res.status(400).json({ msg: "please enter all fields" });
    }

    //Check for existence
    let user  
    if(email){
        user = email
    }else{
        user = phone
    }
    User.findOne({ user }).then(user => {

        if (user) {
            return res.status(400).json({ msg: "user already exist " });
        }
        const newUser = new User({
            name,
            email,
            password,
            phone,
            blood_group,
            coordinates
        });

        if (password) {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    newUser.password = hash
                    newUser.save((err, user) => {
                        if (!err) {

                            res.json({ sucess: true, user })
                        }
                        if (err) {
                            res.json(err.message)
                        }
                    })
                })

            })
        }
    })
})


router.post("/login", (req, res, next) => {
    const { email, password } = req.body;

    //simple Validation
    if (!email || !password) {
        return res.status(400).json({ msg: "please enter all fields" });
    }

    //Check for existence
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(400).json({ msg: "user does not exist " });
        }


        // Validate password
        passport.authenticate('local', (err, user) => {
            if (user) {
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" })
                        if (isMatch) {

                            req.logIn(user, () => {
                                res.json(user)
                            })
                        }
                    });

                if (err) {
                    console.log(err);

                }

            }
        })(req, res, next);
    })
})





module.exports = router
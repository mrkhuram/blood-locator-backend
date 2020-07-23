let passport = require('passport')
let Strategy = require('passport-local').Strategy
let User = require('../models/SignUp')




let myStrategy = new Strategy({
    usernameField: "email"
}, (email, password, next) => {

    User.findOne({ email }, (err, userFound) => {
        if (userFound) {
            next(null, userFound)
        } else {
            next(null, null)
        }
    })
})

passport.use(myStrategy)

module.exports = passport
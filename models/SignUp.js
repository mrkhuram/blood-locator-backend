let mongoose = require('mongoose')
let Schemas = mongoose.Schema

let userSchema = Schemas({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    blood_group: {
        type: String,
        required: true
    },
    coordinates: {

        latitude: {
            type: Number,
            required: false
        },

        longitude: {
            type: Number,
            required: false
        }
    },
    last_donation: {
        type: Date,
        required: false,
        default: Date.now()
    }

})

let User = mongoose.model('user',userSchema);

module.exports = User
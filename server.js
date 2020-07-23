let express = require('express')
let expressSession = require('express-session')
let bodyParser = require('body-parser')
let app = express()
let passport = require('./config/passportConfig')
let PORT = 9090
let User = require('./models/SignUp')
let userRoutes = require('./routes/Auth')
let cors = require('cors')
let cookieParser = require('cookie-parser')
let moment = require("moment")

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("This is the secret that will use for the backend of the blood locatorrr..."))
app.use(expressSession({
    secret: 'This is the secret that will use for the backend of the blood locatorrr...',
    maxAge: 3600000,
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());



const accountSid = 'ACa276abce3a3d903091e60306e0f5784e';
const authToken = '78ab1b3e63f1dc3a6d146f766ac20ef5';
const client = require('twilio')(accountSid, authToken);



passport.serializeUser((user, next) => {
    next(null, user.id)
})
passport.deserializeUser((userID, next) => {

    User.findOne({ _id: userID }, (err, user) => {
        next(err, user)
    })
})

require('./config/mongo')

app.get('/', (req, res) => {
    res.send("Welcome to the backend of blood locator.")
})
app.use('/auth', userRoutes)
app.post('/send/sms', (req, res) => {

    let { name, blood_group, phone } = req.body.user
    client.messages
        .create({
            body: `Hello sir, I'm ${name} here. I've found that your blood group is ${blood_group} and You want to donate. I need it very urgently, Kindly contact me at this number ${phone}`,
            from: '+13343262699',
            to: req.body.userPhoneNo
        })
        .then(message => {
            console.log(message.sid)
            res.send({ success: true })
        });
})

let maxDistance = 6;
function getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km (change this constant to get miles)
    var dLat = ((lat2 - lat1) * Math.PI) / 180;
    var dLon = ((lon2 - lon1) * Math.PI) / 180;
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
    // if (d > 1) return Math.round(d) + "km";
    // else if (d <= 1) return Math.round(d * 1000) + "m";
    return d;
}
app.post("/getnearestlocations", (req, res) => {
    //fsd
    // let cLongtitude = 31.418906141938;
    // let cLatitude = 73.0717697806911;
    let { distance, blood_group, longitude, latitude } = req.body
    let cLongtitude = longitude
    let cLatitude = latitude
    //gojra
    // let cLongtitude = 31.137899;
    // let cLatitude = 72.662622;

    User.find({}, function (err, users) {
        // let distance = 0;
        let nearByLocations = users.filter(user => {
            distance = parseFloat(
                getDistance(
                    cLongtitude,
                    cLatitude,
                    user.coordinates.latitude,
                    user.coordinates.longitude
                )
            );
            return distance;
        });
        nearByLocations.distance = distance.toPrecision(4);
        nearByLocations = nearByLocations.map(user => {
            let obj = JSON.parse(JSON.stringify(user));
            obj.distance = getDistance(
                cLongtitude,
                cLatitude,
                user.coordinates.latitude,
                user.coordinates.longitude
            );
            console.log(distance);
            return obj;
        });
        console.log(nearByLocations);
        let canDonate = []
        nearByLocations.map((user, ind) => {
            let last_donation = user.last_donation
            var momentA = moment(last_donation, 'DD-MM-YYYY');
            var momentB = moment()
            let result = momentB.diff(momentA, "month")
            console.log(result);
            if(result < 4){
                canDonate.push(user)
            }
            
        })
        res.json(canDonate);
    });
});

app.listen(process.env.PORT || PORT, () => {

    console.log('Now I am chaling ' + PORT);

});


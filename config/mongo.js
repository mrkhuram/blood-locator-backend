let mongoose = require('mongoose');

// let path = "mongodb://localhost:27017/myTestDB"
    let path = "mongodb+srv://ethereum1:ethereum123@cluster0-jukcx.mongodb.net/blood?retryWrites=true&w=majority"

    mongoose.connect(path, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(()=>{
        console.log('db connected');
        
    })
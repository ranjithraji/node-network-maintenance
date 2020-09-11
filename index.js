const express=require('express');
const body=require('body-parser');
const cors=require('cors');
const mongoose=require('mongoose');
const app=express();
const passport=require('passport')

//port creation
const port=5000
//use the cors method
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(body.urlencoded({ extended: false }))
 
// parse application/json
app.use(body.json());
app.use(passport.initialize());

// Connecting to the database
mongoose.connect('mongodb://localhost:27017/networkMaintenance', {
    useNewUrlParser: true,
    useUnifiedTopology: true ,
    useFindAndModify:true
}).then(() => {
    console.log("Database connected Successfully its ready to store your data ");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to our network maintenance platfrom."});
});


//api assign with router
const user=require('./route/router');
app.use('/api',user);

// listen for requests
app.listen(port, () => {
    console.log(`Server was ready to access in port no ${port}`);
});
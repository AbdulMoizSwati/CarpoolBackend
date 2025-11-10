require('dotenv').config();
const mongoose = require("mongoose");

const url = process.env.MONGODBCONNECT;

function Connect(url){
mongoose.connect(url).then(()=>{
    console.log("Mongo Db is Connected Sucessfully");
}).catch((err)=>{
    console.log(`error of connection databse ${err}`)
});
}

module.exports = Connect;

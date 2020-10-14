const fs = require('fs');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env"});     // * to fetch config items from file
const Tour = require("../../models/tourModel");

// * It is just to replace database password dynamically
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

// * It is to connect with cloud database 
// * to change to local database replace DB with process.env.DATABASE_LOCAL
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then((cons) => console.log("connected successfully"));

// Fetch the data from json file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"));

// EXPORT DATA INTO MONGOOSE DATABASE

const exportData = async () => {
    try{
        await Tour.create(tours);
        console.log("Data uploaded successfully");
    }catch(error) {
        console.log(error);
    }

    process.exit();
}

const deleteData = async () => {
    try{
        await Tour.deleteMany();
        console.log("Data removed successfully");
    }catch(error){
        console.log(error);
    }

    process.exit();
}


console.log(process.argv);


if(process.argv[2] === "--export"){
    exportData()
}

if(process.argv[2] === "--delete"){
    deleteData();
}
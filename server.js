const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env"});     // * to fetch config items from file
const app = require("./app");       // app from app.js running express

// * It is just to replace database password dynamically
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

// * It is to connect with cloud database 
// * to change to local database replace DB with process.env.DATABASE_LOCAL
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then((cons) => {
    // console.log(cons.connection)}
    console.log("Database connected !!")
});


const port = process.env.PORT ;
app.listen(port, () => {
    console.log(`Server running at ${port}`);
})
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env"});     // * to fetch config items from file
const app = require("./app");       // app from app.js running express

// Sync rejection error handled for entire application
process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    process.exit(1);
})

// * It is just to replace database password dynamically
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

// * It is to connect with cloud database 
// * to change to local database replace DB with process.env.DATABASE_LOCAL
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then((cons) => {
    // console.log(cons.connection)}
    console.log("Database connected !!")
});


const port = process.env.PORT || 5000 ;
const server = app.listen(port, () => {
    console.log(`Server running at ${port}`);
});

// unhandled promise rejection (async handled rejection error in entire application)
process.on("unhandledRejection", (err) => {
    console.log("unhandledRejection" , err.name, err.message);
    console.log("shutting down" , err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
});

// handling heroku specific SIGTERM event handler to shut down server

process.on("SIGTERM", () => {
    console.log("SIGTERM RECEIVED, Shutting down server !!!");
    server.close(() => {
        console.log("Server Terminated !!!");
    })
})
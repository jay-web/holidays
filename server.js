const dotenv = require('dotenv');
dotenv.config({ path: "./config.env"});

const app = require("./app");

console.log(process.env.NODE_ENV);

const port = process.env.PORT ;
app.listen(port, () => {
    console.log(`Server running at ${port}`);
})
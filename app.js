const express = require("express");

const app = express();

app.get("/", (req, res ) => {
    res
        .status(200)
        .json({app: "Holidays"});
})





const port = 3000;
app.listen(port, () => {
    console.log(`Server running at ${port}`);
})
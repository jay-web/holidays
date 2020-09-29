const express = require("express");
const fs = require("fs");
const app = express();

// fetch tours collection
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


app.get("/api/v1/tours", (req, res) => {
    res
        .status(200)
        .json(
            {   status: "success",
                data : {
                    tours: tours}
                }
            )
})





const port = 3000;
app.listen(port, () => {
    console.log(`Server running at ${port}`);
})
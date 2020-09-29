const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());    // middleware to read req.body

// fetch tours collection from local db file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// * GET request of tours collection resource
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

app.post("/api/v1/tours", (req, res) => {
    let newid = tours.length;
    let newTour = Object.assign({id: newid}, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err,data) => {
        res
            .status(201)
            .json({
                status: "success",
                data: {
                    tour: newTour
                }
            })
    });

})



const port = 3000;
app.listen(port, () => {
    console.log(`Server running at ${port}`);
})
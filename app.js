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

// * GET request of tours collection resource to get single tour info

app.get("/api/v1/tours/:id", (req, res) => {
    let id = req.params.id * 1; // ? to convert string into int
  
    let tour = tours.find((el) => { 
        return el.id === id 
    });

    // if search tour not available as per id
    if(!tour){
        return res.status(404).json({
            status: "failed",
            message: "Invalid id"
        })
    }

    // if we found the tour as per id

    res.status(200).json({
        status: "success",
        data: {
            tour: tour
        }
    })
})

// * POST request to create/add new tour
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

// * PATCH request of tour resource to edit/update any tour info

app.patch("/api/v1/tours/:id", (req, res) => {
    let id = req.params.id * 1; // convert string into int
    let tour = tours.find(el => el.id === id);

    // if tour not found as per id
    if(!tour){
        res.status(404).json({
            status: "failed",
            message: "Invalid id"
        })
    }

    let editTour = {...tour, ...req.body};
    
    let editTours = tours.map((el) => {
        if(el.id === id){
            el = editTour
        }
        return el;
    })


    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(editTours), (error, data) => {
        if(error) {
            return res.status(400).json({
                status: "failed",
                message: error.message
            })
        }
        res.status(200).json({
            status: "success",
            data: {
                tour: editTour
            }
        })
    })

   

    
})



const port = 3000;
app.listen(port, () => {
    console.log(`Server running at ${port}`);
})
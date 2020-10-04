const express = require("express");
const fs = require("fs");
const app = express();
const morgan = require("morgan");


app.use(morgan('dev'));     // logger middleware for console
app.use(express.json());    // middleware to read req.body

// fetch tours collection from local db file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const getAllTours = (req, res) => {
    res
        .status(200)
        .json(
            {   status: "success",
                data : {
                    tours: tours}
                }
            )
}

const getTour = (req, res) => {
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
}

const createTour = (req, res) => {
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

}

const updateTour = (req, res) => {
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

}

const deleteTour = (req, res) => {
    let id = req.params.id * 1; // convert string into int
    
    let tour = tours.find((el) => el.id === id);

    // * if tour not found as per id
    if(!tour){
        return res.status(404).json({
            status: "failed",
            message : "invalid id"
        })
    }

    let tourAfterDelete = tours.filter((el) => {
        if(el.id !== id){
            return el;
        };
    })

    console.log({tourAfterDelete});

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tourAfterDelete), (error, data) => {
        return res.status(204).json({
            status: "success",
            
        })
    })
}

// Users Route handlers

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not created yet"
    })
}
const getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not created yet"
    })
}
const createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not created yet"
    })
}
const updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not created yet"
    })
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not created yet"
    })
}

const tourRouter = express.Router();


app.use('/api/v1/tours', tourRouter);       // mounting routes

// * GET request of tours collection resource
tourRouter.get("/", getAllTours);

// * GET request of tours collection resource to get single tour info
tourRouter.get("/:id", getTour);

// * POST request to create/add new tour
tourRouter.post("/", createTour);

// * PATCH request of tour resource to edit/update any tour info
tourRouter.patch("/:id", updateTour);

// * DELETE request of tour resource to delete any tour as per id
tourRouter.delete("/:id", deleteTour);

const userRouter = express.Router();

app.use("/api/v1/users", userRouter);

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUser);
userRouter.post("/", createUser);
userRouter.patch("/:id", updateUser);
userRouter.delete("/:id", deleteUser);



const port = 3000;
app.listen(port, () => {
    console.log(`Server running at ${port}`);
})
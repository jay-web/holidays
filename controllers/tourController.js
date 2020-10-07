const fs = require("fs");

// fetch tours collection from local db file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// * params middleware to check valid passed id

exports.checkId = (req, res, next, val) => {
  console.log(typeof val);
  let tour = tours.find((el) => {
    return el.id === val * 1;  
  });

  // if search tour not available as per id
  if (!tour) {
    return res.status(404).json({
      status: "failed",
      message: "Invalid id",
    });
  }

  next();
}

// * custom middleware to check req.body
exports.checkBody = (req, res, next) => {
  console.log(req.body);
  if(!req.body.name){
    return res.status(400).json({
      status: "failed",
      message: "name is mandatory in new tour"
    })
  }
  next();
}

// Tours Route handlers/controllers
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tours: tours,
    },
  });
};

exports.getTour = (req, res) => {
  let id = req.params.id * 1; // ? to convert string into int
  // * Below code will run if params middleware get passed
  let tour = tours.find((el) => {
    return el.id === id;
  });
  // if we found the tour as per id
  res.status(200).json({
    status: "success",
    data: {
      tour: tour,
    },
  });
};

exports.createTour = (req, res) => {
  let newid = tours.length;
  let newTour = Object.assign({ id: newid }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err, data) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  let id = req.params.id * 1; // convert string into int

  let tour = tours.find((el) => {
    return el.id === id * 1;  
  });

  let editTour = { ...tour, ...req.body };

  let editTours = tours.map((el) => {
    if (el.id === id) {
      el = editTour;
    }
    return el;
  });

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(editTours),
    (error, data) => {
      if (error) {
        return res.status(400).json({
          status: "failed",
          message: error.message,
        });
      }
      res.status(200).json({
        status: "success",
        data: {
          tour: editTour,
        },
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  let id = req.params.id * 1; // convert string into int
  // * Below code will run if params middleware get passed
  let tourAfterDelete = tours.filter((el) => {
    if (el.id !== id) {
      return el;
    }
  });


  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tourAfterDelete),
    (error, data) => {
      return res.status(204).json({
        status: "success",
      });
    }
  );
};

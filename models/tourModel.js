const mongoose = require("mongoose");
const slugify = require("slugify");

// * Creating Schema of tour collection
const tourSchema = mongoose.Schema({
    name : {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        trim: true,
        minLength: 5
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a Group size"],
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "difficult"],
        required: [true, "A tour must have a difficulty"],
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        max: 5

    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"],
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, "A tour must have a description"],
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, "A true must have a image cover"]
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date],
    startLocation: {
        // GeoJson
        type: {
            type: String,
            default: "Point",
            enum: ["Point"]
        },
        coordinates: [Number],
        address: String,
        description: String

    },
    locations: [
        {
            type: {
                type: String,
                default: "Point",
                enum: ["Point"]
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ]
},  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  });


// Implementing indexing on price to improve query
tourSchema.index({ price: 1, ratingsAverage: -1});  //! 1 means in ascending order

// DOCUMENT MIDDLEWARE: run before .save() or .create()
tourSchema.pre("save", function (next){
    this.slug = slugify(this.name, {lower: true});
    next();
})


// Virtual Populate
tourSchema.virtual("reviews", {
    ref: "Review",
    foreignField: "tour",
    localField: "_id",
   
})

// Query Middlware : it will run on mentioned query (like find query)
tourSchema.pre(/^find/, function(next) {
    // populate will take out data from other document as per the reference
    this.populate({ path: "guides", select: "-__v"})
    next();
})




// * Create tour model from schema
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
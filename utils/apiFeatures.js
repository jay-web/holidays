class APIFeatures {
    constructor(query, queryString){
      this.query = query;
      this.queryString = queryString;
    }
  
    filter(){
        // * Build filter query   - STEP ONE
        const queryObject = { ...this.queryString };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObject[el]);
  
        // * Advanced filtering like lt, lte, gt, gte  - STEP TWO
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
  
        this.query = this.query.find(JSON.parse(queryString));
  
        return this;
    }
  
    sort(){
      // * Sorting      -- STEP THREE
      if(this.queryString.sort){
        const sortBy = this.queryString.sort.split(",").join(" ");
        this.query = this.query.sort(sortBy);
      }else{
        this.query = this.query.sort("-createdAt");
      }
      return this;
    }
  
    limitFields(){
      // * Fields Limitation      -- STEP FOUR
      if(this.queryString.fields){
        const limitFields = this.queryString.fields.split(",").join(" ");
        this.query = this.query.select(limitFields);
      }else{
        this.query = this.query.select("-__v"); // exclude this property
      }
      return this;
    }
  
    pagination(){
        // * Pagination     -- STEP FIVE
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip =(page - 1) * limit;
    
        this.query = this.query.skip(skip).limit(limit);
    
        // if(req.query.page ){
        //   const numTours = await Tour.countDocuments();
        //   if(skip >= numTours) throw new Error("This page doesn't exit");
        // }
  
        return this;
    }
  }

  
  module.exports = APIFeatures;
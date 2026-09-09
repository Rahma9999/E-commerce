//new ApiFeatures(Product.find(), req.query)
class ApiFeature {
    constructor (query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        const queryObj = {...this.queryString};
        const excludedfields = ['page', 'sort', 'limit', 'fields'];
        excludedfields.forEach(el => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        
        console.log('filter [queryStr]: ', queryStr);
        console.log('filter[query]: ', this.query);
        return this;
    }

    sort() {
        if(this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }  else {
        this.query = this.query.sort('-createdAt');
        }

        // console.log('sort: ', this.query);
        return this;
    }

    limitField(){ 
        if(this.queryString.fields){ 
            const fields = this.queryString.fields.split(',').join(' '); 
            this.query = this.query.select(fields); 
        } else{ 
            this.query=this.query.select('-__v'); 
        } 

        // console.log('limitFeild: ', this.query);
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        // console.log('paginate: ', this.query);
        return this;
    }
}

module.exports = ApiFeature;
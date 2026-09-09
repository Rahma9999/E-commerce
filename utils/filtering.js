const filter = (query) => {
    const queryObj = {...query}
    const excludedFile = ['page', 'limit', 'sort', 'feilds']
    excludedFile.forEach(el => delete queryObj[el]);

    /////////advanced filtering///////////
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    console.log(JSON.parse(queryStr));
    let result = JSON.parse(queryStr);
    let filters = {};
    for (const key in queryObj) {
        const match = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/);

        if (match) {
            const [, field, operator] = match;

            filters[field] = {
                [`$${operator}`]: queryObj[key]
            };
        } else {
            filters[key] = queryObj[key];
        }
    }
    // console.log(filters);

    return result;
}

module.exports = filter
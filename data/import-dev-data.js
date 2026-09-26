/* node ./data/import-dev-data.js --delete */
/* node ./data/import-dev-data.js --import */

const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
// const Review = require('../models/reviewModel');
// const User = require('../models/userModel');

const DB = process.env.DATABASE.replace('<DB_PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(DB)
.then((con) => {
    console.log('DB connection successful');
})
.catch(err => console.error(err));

const categories = JSON.parse(fs.readFileSync(`${__dirname}/categories.json`));
const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`));
// const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`));
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));

const importData = async () => {
    try{
        await Category.create(categories);
        await Product.create(products);
        // await Review.create(reviews);
        // await User.create(users);
        console.log('Import data successfully!!');
    }catch(err){
        console.log(err)
    }
process.exit();
}

const deleteData = async () => {
    try{
        await Category.deleteMany();
        await Product.deleteMany();
        // await Review.deleteMany();
        // await User.deleteMany();
        console.log('Delete data successfully!!');
    }catch(err){
        console.log(err)
    }
process.exit();
}

// console.log(process.argv);

if(process.argv[2]  === '--import') 
    importData();
else if(process.argv[2] === '--delete')
    deleteData();
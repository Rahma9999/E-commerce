const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const Product = require('../models/productModel');

const DB = process.env.DATABASE.replace('<DB_PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(DB)
.then((con) => {
    console.log('DB connection successful');
})
.catch(err => console.error(err));

const data = JSON.parse(fs.readFileSync(`${__dirname}/products.json`));

const importData = async () => {
    try{
        await Product.create(data);
        console.log('Import products successfully!!');
    }catch(err){
        console.log(err)
    }
process.exit();
}

const deleteData = async () => {
    try{
        await Product.deleteMany();
        console.log('Delete products successfully!!');
    }catch(err){
        console.log(err)
    }
process.exit();
}

if(process.argv[2]  === '--import') 
    importData();
else if(process.argv[2] === '--delete')
    deleteData();
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const Category = require('../models/categoryModel');

const DB = process.env.DATABASE.replace('<DB_PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(DB)
.then((con) => {
    console.log('DB connection successful');
})
.catch(err => console.error(err));

const data = JSON.parse(fs.readFileSync(`${__dirname}/categories.json`));

const importData = async () => {
    try{
        await Category.create(data);
        console.log('Import categories successfully!!');
    }catch(err){
        console.log(err)
    }
process.exit();
}

const deleteData = async () => {
    try{
        await Product.deleteMany();
        console.log('Delete categories successfully!!');
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
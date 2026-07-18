const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const express = require('express');
const mongoose = require('mongoose');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/ErrorController');
const UserRouter = require('./routes/userRoute')

const app = express();
app.use(express.json());
const DB = process.env.DATABASE.replace('<DB_PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(DB)
.then((con) => {
    // console.log(con.connection);
    console.log('DB connection successful');
})
.catch(err => console.error(err));

app.use('/user', UserRouter);

app.all('/{*any}', (req, res, next) => {
    next(new AppError(
        `Can't find ${req.originalUrl} on this server!`,
        404
    ));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on PORT: ${port}`);
});
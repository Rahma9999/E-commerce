const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const express = require('express');
const mongoose = require('mongoose');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/ErrorController');
const UserRouter = require('./routes/userRoute')
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());
const DB = process.env.DATABASE.replace('<DB_PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(DB)
.then((con) => {
    // console.log(con.connection);
    console.log('DB connection successful');
})
.catch(err => console.error(err));

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',

        info: {
            title: 'E-Commerce Shop API',
            version: '1.0.0',
            description: 'API documentation for the E-Commerce Shop backend',
        },

        servers: [
            {
                url: 'https://e-commerce-shop.up.railway.app',
                description: 'Production server',
            },
            {
                url: 'http://localhost:3000',
                description: 'Local development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./swagger_docs/*.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION 💣: Shuting down...');
    console.log(err.name, err.message);
    console.error(err.stack);
    process.exit(1);
});

const express = require('express');
const mongoose = require('mongoose');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/ErrorController');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

// security options
const rateLimit = require('express-rate-limit');
const helmet = require('helmet')
// const mongoSantize = require('express-mongo-sanitize'); // Incompatible with Express 5.
const mongoSantize = require('@exortek/express-mongo-sanitize');
// const xss = require('xss-clean');
const { xss } = require('express-xss-sanitizer')
const hpp = require('hpp')
const compression = require('compression')

const UserRouter = require('./routes/userRoute')
const ProductRouter = require('./routes/productRoute')
const ReviewRouter = require('./routes/reviewRouter')
const CategoryRouter = require('./routes/categoryRoute')
const WishlistRouter = require('./routes/wishlistRoute')
const OrderRouter = require('./routes/orderRouter')
const CartRouter = require('./routes/cartRouter')

const app = express();

// security headers
app.use(helmet());
// It gzips JSON responses (often 70-90% smaller), which matters for big lists like products.
app.use(compression())
app.use(express.json({ limit: '10kb' }));

// limit the request come from the same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/', limiter);

// Data sanitize against NoSQL injuction
app.use(mongoSantize());

// Data sanitize aganist XSS 
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp({
    whitelist: [
        'price', 
        'discountPrice', 
        'stock', 
        'ratingAverage', 
        'ratingQuantity'
    ]
}));

app.set('trust proxy', 1);

const DB = process.env.DATABASE.replace('<DB_PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(DB)
.then((con) => {
    // console.log(con.connection);
    console.log('DB connection successful');
})
// .catch(err => console.error(err));

app.set('query parser', 'extended');

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

app.use('/product', ProductRouter)
app.use('/category', CategoryRouter)
app.use('/user', UserRouter)
app.use('/review', ReviewRouter)
app.use('/wishlist', WishlistRouter)
app.use('/order', OrderRouter)
app.use('/cart', CartRouter)

app.all('/{*any}', (req, res, next) => {
    next(new AppError(
        `Can't find ${req.originalUrl} on this server!`,
        404
    ));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server running on PORT: ${port}`);
});

//////// Important in any project to handle with unhandled rejection /////////
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION 💣: Shuting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});


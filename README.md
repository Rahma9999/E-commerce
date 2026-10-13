# 🛍️ E-Commerce Clothing Shop API

A RESTful backend API for an online clothing store, built with **Node.js, Express.js, and MongoDB**. The application provides product management, user authentication, shopping cart and wishlist functionality, order management, reviews, and more.

This project demonstrates backend development concepts, REST API design, database modeling, authentication, security best practices, centralized error handling, and API documentation.

## 🚀 Features

### 👤 Authentication & User Management
- User registration and login
- Password hashing and secure authentication
- JWT-based authentication and protected routes
- Role-based authorization
- Password reset functionality
- OTP verification via email (if configured)
- User profile management

### 👕 Products & Categories
- Create, retrieve, update, and delete products
- Product categorization
- Product filtering and sorting
- Pagination and field limiting
- Product search and price filtering
- Product ratings and reviews
- Deal and discount management

### 🛒 Shopping Features
- Shopping cart management
- Add and remove products from the wishlist
- Order creation and retrieval
- Order management and status tracking

### ⭐ Reviews & Ratings
- Create, update, and delete reviews
- Associate reviews with products and users
- Calculate average product ratings
- Retrieve product reviews using MongoDB relationships

### 📧 Email Integration
- Email delivery using SendGrid (if configured)
- OTP email verification
- Password reset emails

### 🛡️ Security
The application uses security middleware and validation techniques to help protect API endpoints.

- **Helmet** — sets HTTP security headers
- **express-mongo-sanitize** — helps prevent NoSQL injection
- **HPP (HTTP Parameter Pollution)** — helps protect against parameter pollution
- **express-rate-limit** — limits repeated requests to configured endpoints
- **CORS** — controls cross-origin access according to configuration
- **JWT authentication** — protects private routes
- **Password hashing** — protects stored passwords
- **Input validation and sanitization** — helps handle untrusted input
- **Centralized error handling** — provides consistent API error responses
- **Compression** — reduces response size using gzip or other supported compression methods

## 🧰 Tech Stack

### Backend
- Node.js
- Express.js
- JavaScript

### Database
- MongoDB
- Mongoose ODM

### Authentication & Email
- JSON Web Tokens (JWT)
- bcrypt or bcryptjs (depending on the installed package)
- SendGrid (for email delivery, if configured)

### API Documentation
- Swagger UI
- OpenAPI Specification

### Security & Performance
- Helmet
- express-mongo-sanitize
- HPP
- express-rate-limit
- CORS
- Compression

### Deployment
- Railway
- MongoDB Atlas (if used for the deployed database)

## 🏗️ Project Architecture

The project follows a modular structure that separates routes, controllers, models, middleware, and utility functions.

```text
E-commerce/
├── data/
│   ├── categories.json
│   ├── products.json
│   ├── import-dev-data.js
├── controllers/
│   ├── authController.js
│   ├── categoryController.js
│   ├── productController.js
│   ├── ErrorController.js
│   ├── handlerFactory.js
│   ├── userController.js
│   ├── reviewController.js
│   ├── wishlistController.js
│   ├── cartController.js
│   └── orderController.js
├── models/
│   ├── userModel.js
│   ├── productModel.js
│   ├── categoryModel.js
│   ├── reviewModel.js
│   ├── otpModel.js
│   ├── cartModel.js
│   └── orderModel.js
├── routes/
│   ├── userRouter.js
│   ├── productRouter.js
│   ├── categoryRouter.js
│   ├── reviewRouter.js
│   ├── wishlistRouter.js
│   ├── cartRouter.js
│   └── orderRouter.js
├── views/email/
│   ├── resetPassword.html
│   ├── sendOTP.html
├── utils/
│   ├── AppError.js
│   ├── catchAsync.js
│   ├── handlerFactory.js
│   └── email.js
├── swagger_docs/
│   ├── authDoc.js
│   ├── productDoc.js
│   ├── categoryDoc.js
│   ├── reviewDoc.js
│   ├── userDoc.js
│   ├── wishlistDoc.js
│   ├── cartDoc.js
│   └── orderDoc.js
├── app.js
├── server.js
├── package.json
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

- Node.js and npm
- MongoDB locally or a MongoDB Atlas account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Rahma9999/E-commerce.git
cd E-commerce
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

```env
NODE_ENV=development
PORT=3000

DATABASE =  mongodb+srv://rahmanasser9626_db_user:<DB_PASSWORD>@cluster0.mvbyjjg.mongodb.net/?appName=Cluster0
DB_PASSWORD = Rahma9626Nasser

JWT_SECRET =  QR576SD@FJdH4L%d4fdD5sO^Fa6$Wc4*
JWT_EXPIRES_IN = 7d
JWT_COOKIES_EXPIRES_IN = 90

EMAIL_HOST =sandbox.smtp.mailtrap.io
EMAIL_POST = 2525
EMAIL_USERNAME = 71d77918d30e97
EMAIL_PASSWORD = 037f1199fc22c0

EMAIL_FROM = rahmanasser9626@gmail.com

SENDGRID_USERNAME = apikey 
SENDGRID_PASSWORD = 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
```

### 4. Start the application

```bash
npm run start
```

## 📚 API Documentation

This project uses Swagger UI to document API endpoints, request parameters, request bodies, authentication requirements, and response schemas.

When Swagger is configured at `/api-docs`, open:

```text
http://localhost:3000/api-docs
```
OR
```text
https://e-commerce-shop.up.railway.app/api-docs
```

The documented endpoints should include:

- Authentication and user management
- Products and categories
- Reviews and ratings
- Shopping cart
- Wishlist
- Orders

## 🔐 Authentication

Protected endpoints require a valid JWT access token.

Example HTTP header:

```http
Authorization: Bearer <your_access_token>
```

## ⚠️ Error Handling

The application uses centralized error handling to provide consistent responses and avoid repeating error-handling logic across controllers.

Key components include:

- `AppError` — creates operational errors with status codes and messages
- `catchAsync` — forwards asynchronous controller errors to Express error-handling middleware
- `handlerFactory` — reuses common CRUD operations where appropriate
- `ErrorController` — handles application errors and formats API responses

Example error response:

```json
{
  "status": "fail",
  "message": "Product not found"
}
```

## 🚄 Deployment on Railway

The backend can be deployed on Railway, provided the project and its dependencies are compatible with the deployment environment.

## 🧪 Testing

Test your API endpoints using Postman or another HTTP client.

Recommended testing areas:

- Registration and login
- Protected routes and authorization
- Product CRUD operations
- Filtering, sorting, and pagination
- Reviews and average rating calculations
- Cart and wishlist operations
- Order creation and retrieval
- Password reset and OTP flows, if enabled
- Validation errors and unauthorized requests

## 🔮 Future Improvements

- Integrate a payment gateway
- Add automated tests with Jest or another suitable testing framework
- Add CI/CD workflows
- Add Docker
- Expand API documentation and validation
- Add automated API integration tests

## 👩‍💻 About the Project

This project is a backend portfolio project that demonstrates practical knowledge of Node.js, Express.js, MongoDB, RESTful APIs, authentication, security middleware, reusable controller logic, error handling, and API documentation.

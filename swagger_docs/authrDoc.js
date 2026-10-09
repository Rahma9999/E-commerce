/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Authentication, andt OTP verification.
 */

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Create a new user account
 *     description: Register a new customer and return a JWT authentication token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - passwordConfirm
 *               - phone
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user1@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: user@1234
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 example: user@1234
 *               phone:
 *                 type: string
 *                 example: "01234567890"
 *               avatar:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered and OTP email sent.
 *       400:
 *         description: Invalid input or validation error 
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate a user using email and password and return a JWT token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user1@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: user@1234
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIs...
 *       400:
 *         description: Please provide email and password! or Email not verified.
 *       401:
 *         description: Incorrect email or password!
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /user/verifyOTP:
 *   post:
 *     summary: Verify an email using a five-digit OTP
 *     description: The OTP expires after 10 minutes.
 *     tags: 
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user1@gmail.com
 *               otp:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 5
 *                 example: 12345
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid, expired, or missing OTP
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/resendOTP:
 *   post:
 *     summary: Request a new verification OTP
 *     tags: [Authentication]
 *     description: Sends a replacement OTP to the user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user1@gmail.com
 *     responses:
 *       200:
 *         description: New OTP sent successfully
 *       400:
 *         description: Missing email or invalid request
 *       404:
 *         description: User not found
 *       500:
 *         description: Email delivery error
 */

/**
 * @swagger
 * /user/forgetPassword:
 *   post:
 *     summary: Request password reset
 *     description: Send a password reset token to the user's email address.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user1@gmail.com
 *     responses:
 *       200:
 *         description: Password reset token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: a1b2c3d4e5f6...
 *                 message:
 *                   type: String
 *                   example: Token sent to email
 *       404:
 *         description: User with the provided email does not exist
 *       500:
 *         description: Error while sending reset email
 */

/**
 * @swagger
 * /user/resetPassword/{token}:
 *   patch:
 *     summary: Reset user password
 *     description: Reset the user's password using the password reset token.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Password reset token received by email.
 *         schema:
 *           type: string
 *         example: a1b2c3d4e5f6
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - passwordConfirm
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: newPassword123
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password successfully reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIs...
 *       400:
 *         description: Invalid or expired reset token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/updateMyPassword:
 *   post:
 *     summary: Request update password
 *     description: take the current password, new password, and confirm password to update the user password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - passwordCurrent
 *               - password
 *               - passwordConfirm
 *             properties:
 *               passwordCurrent:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: 123456789
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: 123456789
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: 123456789
 *     responses:
 *       200:
 *         description: The password has been updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: a1b2c3d4e5f6...
 *       400:
 *         description: The current password is required || The Password must be at least 8 characters
 *       401:
 *         description: You current password is wrong
 *       500:
 *         description: Server Error
 */


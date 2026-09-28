/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get the current logged-in user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     doc:
 *                       type: object
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 */

/**
 * @swagger
 * /user/updateMe:
 *   post:
 *     summary: Request to update the profile data
 *     description: update firstName or lastName or phone or email.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               phone:
 *                 type: string
 *                 example: "01234567890"
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
 *         description: This route is not for password update, Please use /updateMyPassword.
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /user/deleteMe:
 *   delete:
 *     summary: Deactivate the current account
 *     description: Soft delete. Sets active to false.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Account deactivated (no content)
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     description: Admin only. Supports filtering, sorting, field limiting and pagination.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: object
 *                   properties:
 *                     doc:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *       403:
 *         description: 'You do not have a permission to perform this action'
 *   post:
 *     summary: Update a user (admin)
 *     description: Admin only. Route is POST / and uses the update handler, which reads req.params.id (undefined here). See notes.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       200:
 *         description: User updated
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *       403:
 *         description: 'You do not have a permission to perform this action'
 *       404:
 *         description: 'There is no document with this ID'
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Admin only.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     doc:
 *                       type: object
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *       403:
 *         description: 'You do not have a permission to perform this action'
 *       404:
 *         description: 'There is no document with this ID'
 *   delete:
 *     summary: Delete a user permanently
 *     description: Admin only.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted (no content)
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *       403:
 *         description: 'You do not have a permission to perform this action'
 *       404:
 *         description: 'There is no document with this ID'
 */

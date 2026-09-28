/**
 * @swagger
 * tags:
 *   - name: Category
 *     description: Category Management API
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories
 *     description: Returns all categories. Supports filtering, sorting, field limiting and pagination through query params.
 *     tags:
 *       - Category
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         example: name
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         example: name,slug
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: List of categories
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
 *                   example: 2
 *                 data:
 *                   type: object
 *                   properties:
 *                     doc:
 *                       type: array
 *                       items:
 *                         type: object
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new category
 *     description: Admin only.
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               slug:
 *                 type: string
 *                 example: electronics
 *     responses:
 *       201:
 *         description: Category created
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
 *       400:
 *         description: Validation error
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *       403:
 *         description: 'You do not have a permission to perform this action'
 */

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:#/
 *                   type: object
 *                   properties:
 *                     doc:
 *                       type: object
 *       404:
 *         description: 'There is no document with this ID'
 *   patch:
 *     summary: Update a category
 *     description: Admin only.
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Home Appliances
 *               slug:
 *                 type: string
 *                 example: home-appliances
 *     responses:
 *       200:
 *         description: Category updated
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
 *                     data:
 *                       type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *       403:
 *         description: 'You do not have a permission to perform this action'
 *       404:
 *         description: 'There is no document with this ID'
 *   delete:
 *     summary: Delete a category
 *     description: Admin only.
 *     tags:
 *       - Category
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
 *         description: Category deleted (no content)
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *       403:
 *         description: 'You do not have a permission to perform this action'
 *       404:
 *         description: 'There is no document with this ID'
 */

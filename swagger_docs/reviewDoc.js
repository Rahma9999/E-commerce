/**
 * @swagger
 * tags:
 *   - name: Review
 *     description: Product Reviews API (nested under products)
 */

/**
 * @swagger
 * /product/{productId}/reviews:
 *   get:
 *     summary: Get all reviews
 *     description: Returns reviews. Supports filtering, sorting, field limiting and pagination through query params.
 *     tags:
 *       - Review
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         example: -createdAt
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
 *         description: List of reviews
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
 *                   example: 3
 *                 data:
 *                   type: object
 *                   properties:
 *                     doc:
 *                       type: array
 *                       items:
 *                         type: object
 *   post:
 *     summary: Create a review for a product
 *     description: Roles user or admin. The product comes from the URL and the user from the JWT.
 *     tags:
 *       - Review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - review
 *               - rating
 *             properties:
 *               review:
 *                 type: string
 *                 example: Great product, works as described.
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       201:
 *         description: Review created
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
 *   patch:
 *     summary: Update a review
 *     description: Roles user or admin. Note - this route has no :id in the path, so the handler reads req.params.id which is undefined. See notes.
 *     tags:
 *       - Review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
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
 *               review:
 *                 type: string
 *               rating:
 *                 type: number
 *                 example: 4
 *     responses:
 *       200:
 *         description: Review updated
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *       403:
 *         description: 'You do not have a permission to perform this action'
 *       404:
 *         description: 'There is no document with this ID'
 */

/**
 * @swagger
 * /product/{productId}/reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags:
 *       - Review
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review found
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a review
 *     description: Roles user or admin.
 *     tags:
 *       - Review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Review deleted (no content)
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *       403:
 *         description: 'You do not have a permission to perform this action'
 *       404:
 *         description: 'There is no document with this ID'
 */

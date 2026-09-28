/**
 * @swagger
 * tags:
 *   - name: Product
 *     description: Product Management API
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products
 *     description: Returns all products. Supports filtering, sorting, field limiting and pagination through query params.
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         example: -price
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         example: name,price
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
 *         description: List of products
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
 *                   example: 10
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
 *     summary: Create a new product
 *     description: Admin only. The category is resolved from categorySlug.
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categorySlug
 *             properties:
 *               name:
 *                 type: string
 *                 example: Wireless Mouse
 *               description:
 *                 type: string
 *                 example: Ergonomic 2.4GHz wireless mouse
 *               price:
 *                 type: number
 *                 example: 250
 *               categorySlug:
 *                 type: string
 *                 example: electronics
 *     responses:
 *       201:
 *         description: Product created
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
 *         description: There is no category with this slug / validation error
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *       403:
 *         description: 'You do not have a permission to perform this action'
 */ 

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Returns the product with its reviews populated.
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Product found
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
 *   patch:
 *     summary: Update a product
 *     description: Admin only.
 *     tags:
 *       - Product
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
 *                 example: Wireless Mouse Pro
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 example: 300
 *     responses:
 *       200:
 *         description: Product updated
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
 *     summary: Delete a product
 *     description: Admin only.
 *     tags:
 *       - Product
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
 *         description: Product deleted (no content)
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *       403:
 *         description: 'You do not have a permission to perform this action'
 *       404:
 *         description: 'There is no document with this ID'
 */

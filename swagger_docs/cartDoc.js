/**
 * @swagger
 * /cart/myCart:
 *   get:
 *     tags: [Cart]
 *     summary: Get my cart (created automatically if it does not exist)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The cart with totalItems and totalPrice
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     doc:
 *                       type: object
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *       404:
 *         description: 'There is no document with this ID'
 *
 * /cart/addItem:
 *   post:
 *     tags: [Cart]
 *     summary: Add a product, or increase its quantity if already in the cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product]
 *             properties:
 *               product:
 *                 type: string
 *                 description: Product id
 *                 example: 6abd60d7745f2cb9b370505f
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 99
 *                 default: 1
 *     responses:
 *       200:
 *         description: Updated cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart:
 *                       type: object
 *       400:
 *         description: Invalid quantity or not enough stock
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *       404:
 *         description: 'There is no document with this ID'
 *
 * /cart/{id}:
 *   patch:
 *     tags: [Cart]
 *     summary: Set the quantity of one cart line
 *     description: "`id` is the cart LINE id (`items[]._id`), not the product id."
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 99
 *     responses:
 *       200:
 *         description: Updated cart
 *       400:
 *         description: Invalid quantity or not enough stock
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *       404:
 *         description: 'There is no document with this ID'
 *   delete:
 *     tags: [Cart]
 *     summary: Remove one line from the cart
 *     description: "`id` is the cart LINE id (`items[]._id`)."
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId
 *     responses:
 *       204:
 *         description: Removed
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *       404:
 *         description: 'There is no document with this ID'
 *
 * /cart:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove every item from the cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Cart cleared
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 */
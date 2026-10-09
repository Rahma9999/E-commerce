/**
 * @swagger
 * /order:
 *   post:
 *     tags: [Orders]
 *     summary: Create an order from the current cart
 *     description: |
 *       Prices come from the database, never from the client. Stock is
 *       decreased, the order is created and the cart is emptied in one
 *       transaction. Shipping is free above 1000, otherwise 50.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [shippingAddress]
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 required: [address, phone]
 *                 properties:
 *                   address:
 *                     type: string
 *                     example: 12 Tahrir St, Cairo
 *                   phone:
 *                     type: string
 *                     example: "01012345678"
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash_on_delivery, card]
 *                 default: cash_on_delivery
 *     responses:
 *       201:
 *         description: Order created
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
 *                     order:
 *                       type: object
 *       400:
 *         description: Cart is empty, product unavailable or not enough stock
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *   get:
 *     tags: [Orders]
 *     summary: List all orders (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                        type: object
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *       403:
 *         description: 'You do not have a permission to perform this action'
 *
 * /order/my:
 *   get:
 *     tags: [Orders]
 *     summary: List my orders, newest first
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *
 * /order/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get one of my orders
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
 *       200:
 *         description: The order
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
 *                     order:
 *                       type: object
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *       404:
 *         description: 'There is no document with this ID'
 *
 * /order/{id}/cancel:
 *   patch:
 *     tags: [Orders]
 *     summary: Cancel my order (only while it is pending)
 *     description: Cancelling puts the stock back, inside a transaction.
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
 *       200:
 *         description: Cancelled order
 *       400:
 *         description: Order not found or can no longer be cancelled
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *
 * /order/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Change the status of an order (admin)
 *     description: |
 *       Your router has `':id/status'` without the leading slash. Change it to
 *       `'/:id/status'` so this route works.
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Updated order
 *       401:
 *         description: 'You are not logged in! Please log in to get access.'
 *       403:
 *         description: 'You do not have a permission to perform this action'
 *       404:
 *         description: 'There is no document with this ID'
 */
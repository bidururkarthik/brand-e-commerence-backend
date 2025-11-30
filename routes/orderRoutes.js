const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
    const {
        orderItems,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            totalPrice,
            paidAt: Date.now(),
            isPaid: true // Mock payment
        });

        const createdOrder = await order.save();

        // Send Email
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Or use mailtrap for testing
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: req.user.email,
            subject: `Order Confirmation ${createdOrder._id}`,
            html: `
                <h1>Thank you for your order!</h1>
                <p>Order ID: ${createdOrder._id}</p>
                <p>Date: ${createdOrder.createdAt}</p>
                <h2>Items:</h2>
                <ul>
                    ${createdOrder.orderItems.map(item => `
                        <li>${item.name} (Size: ${item.size}) x ${item.qty} - $${item.price}</li>
                    `).join('')}
                </ul>
                <h3>Total: $${createdOrder.totalPrice}</h3>
            `,
        };

        console.log(mailOptions);

        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent');
        } catch (error) {
            console.error('Error sending email:', error);
            // Don't fail the request if email fails, just log it
        }

        res.status(201).json(createdOrder);
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

module.exports = router;

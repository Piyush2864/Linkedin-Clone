const stripe = require('stripe')('your-stripe-secret-key');
const { User } = require('../models/user.js');



const createStripeSessionController = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);


        if (user.subscription_type === 'premium') {
            return res.status(400).json({
                success: false,
                message: 'You are already a Premium member!'
            });
        }


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd', // You can change the currency if needed
                        product_data: {
                            name: 'Premium Subscription',
                        },
                        unit_amount: 999, // Set the price for Premium subscription in cents (e.g., 9.99 USD)
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`, // Redirect to this URL on success
            cancel_url: `${process.env.CLIENT_URL}/cancel`, // Redirect to this URL on cancel
        });

        res.status(200).json({
            success: true,
            sessionId: session.id
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const paymentConfirmationController = async (req, res) => {
    const endpointSecret = 'your-webhook-signing-secret'; // Replace with your webhook secret
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook error: ${err.message}`);
    }

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id;

        // Upgrade the user to Premium after successful payment
        const user = await User.findByPk(userId);
        if (user) {
            user.subscription_type = 'premium';
            await user.save();
        }
    }

    res.status(200).send('Event received');
}


module.exports = {
    createStripeSessionController,
    paymentConfirmationController,
}
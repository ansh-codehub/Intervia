import Payment from "../models/payment.model.js";
import razorpay from "../services/razorpay.services.js";
import crypto from "crypto";
import User from "../models/user.model.js";

// Plans are controlled by the backend
const plans = {
    basic: {
        amount: 100,
        credits: 800,
    },
    pro: {
        amount: 200,
        credits: 1200,
    },
};


export const createOrder = async (req, res) => {
    try {
        const { planId } = req.body;

        // Get plan from backend
        const plan = plans[planId];

        if (!plan) {
            return res.status(400).json({
                message: "Invalid plan.",
            });
        }

        // Razorpay amount is in paise
        const options = {
            amount: plan.amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Save payment in database
        await Payment.create({
            userId: req.userId,
            planId: planId,
            amount: plan.amount,
            credits: plan.credits,
            razorpayOrderId: order.id,
            status: "created",
        });

        return res.status(201).json(order);

    } catch (error) {
        console.error("Create order error:", error);

        return res.status(500).json({
            message: "Failed to create payment order.",
        });
    }
};


export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        // Validate Razorpay response
        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                message: "Invalid payment data.",
            });
        }

        // Create signature body
        const body =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;

        // Generate expected signature
        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex");

        // Verify signature
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                message: "Invalid payment signature.",
            });
        }

        // Find payment belonging to current user
        const payment = await Payment.findOne({
            razorpayOrderId: razorpay_order_id,
            userId: req.userId,
        });

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found.",
            });
        }

        // Prevent duplicate credit addition
        if (payment.status === "paid") {
            return res.status(200).json({
                success: true,
                message: "Payment already processed.",
            });
        }

        // Mark payment as paid
        payment.status = "paid";
        payment.razorpayPaymentId = razorpay_payment_id;

        await payment.save();

        // Add purchased credits to user
        const updateUser = await User.findByIdAndUpdate(
            payment.userId,
            {
                $inc: {
                    credits: payment.credits,
                },
            },
            {
                new: true,
            }
        );

        if (!updateUser) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified and credits added.",
            user: updateUser,
        });

    } catch (error) {
        console.error("Razorpay verification error:", error);

        return res.status(500).json({
            message: "Payment verification failed.",
        });
    }
};
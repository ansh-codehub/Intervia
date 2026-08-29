import React, { useState } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Pricing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 400,
      description:
        "Perfect for beginners starting interviews preparation.",
      features: [
        "400 AI Interview Credits.",
        "Basic Performance Report.",
        "Voice Interview Access.",
        "Limited History Tracking.",
      ],
      default: true,
    },

    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 800,
      description:
        "Great for focused practice and skill improvement.",
      features: [
        "800 AI Interview Credits.",
        "Detailed Feedback.",
        "Performance Analytics.",
        "Full Interview History.",
      ],
    },

    {
      id: "pro",
      name: "Pro Pack",
      price: "₹200",
      credits: 1200,
      description:
        "Best for serious job preparation.",
      features: [
        "1200 AI Interview Credits.",
        "Advance AI Feedback.",
        "Skill Trend Analysis.",
        "Priority AI Processing.",
      ],
      badge: "Best Value",
    },
  ];

  const handlePayment = async (plan) => {
    // Free plan doesn't need Razorpay
    if (plan.id === "free") {
      return;
    }

    try {
      setLoadingPlan(plan.id);

      // Check Razorpay SDK
      if (!window.Razorpay) {
        alert("Razorpay SDK is not loaded.");
        setLoadingPlan(null);
        return;
      }

      // Only send planId.
      // Backend decides amount and credits.
      const result = await axios.post(
        `${ServerUrl}/api/payment/order`,
        {
          planId: plan.id,
        },
        {
          withCredentials: true,
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: result.data.currency,

        name: "Intervia.AI",
        description: `${plan.name} - ${plan.credits} Credits`,

        order_id: result.data.id,

        handler: async function (response) {
          try {
            console.log("Razorpay response:", response);

            const verifyPay = await axios.post(
              `${ServerUrl}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                withCredentials: true,
              }
            );

            if (verifyPay.data.success) {
              dispatch(setUserData(verifyPay.data.user));

              setLoadingPlan(null);

              alert(
                "Payment successful! Credits have been added."
              );

              navigate("/");
            }
          } catch (error) {
            console.error(
              "Payment verification failed:",
              error.response?.data || error.message
            );

            setLoadingPlan(null);

            alert(
              error.response?.data?.message ||
                "Payment verification failed. Please contact support."
            );
          }
        },

        modal: {
          ondismiss: function () {
            console.log("Payment popup closed");
            setLoadingPlan(null);
          },
        },

        theme: {
          color: "#1067b9",
        },
      };

      const rzp = new window.Razorpay(options);

      // Payment failed
      rzp.on("payment.failed", function (response) {
        console.error(
          "Payment failed:",
          response.error
        );

        setLoadingPlan(null);

        alert(
          response.error?.description ||
            "Payment failed. Please try again."
        );
      });

      rzp.open();
    } catch (error) {
      console.error(
        "Order creation failed:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to create payment order."
      );

      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen py-16 px-6 bg-gradient-to-br from-[#030712] via-[#111827] to-[#312E81]">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-14 items-start gap-4">

        <button
          onClick={() => navigate("/")}
          className="mt-2 p-3 bg-gradient-to-br from-[#111827] to-[#1E1B4B]
          shadow-lg hover:shadow-indigo-500/30
          transition border border-indigo-400/20"
        >
          <FaArrowLeft className="text-indigo-300" />
        </button>

        <div className="text-center w-full">
          <h1 className="text-4xl font-bold text-white">
            Choose Your Plan
          </h1>

          <p className="text-slate-400 mt-3 text-lg">
            Flexible pricing to match your interview preparation goals.
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              whileHover={!plan.default ? { scale: 1.03 } : undefined}
              onClick={() =>
                !plan.default && setSelectedPlan(plan.id)
              }
              className={`relative rounded-3xl p-8 transition-all duration-300
              border
              ${
                isSelected
                  ? "border-cyan-500 bg-blue-950 shadow-2xl shadow-blue-900/50"
                  : "border-slate-700 bg-slate-950 shadow-md"
              }
              ${
                plan.default
                  ? "cursor-default"
                  : "cursor-pointer"
              }`}
            >

              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-6 right-6 bg-emerald-800 text-white
                text-xs px-4 py-1 rounded-full shadow">
                  {plan.badge}
                </div>
              )}

              {plan.default && (
                <div className="absolute top-6 right-6 bg-emerald-800 text-white
                text-xs px-3 py-1 rounded-full shadow">
                  Default
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-semibold text-white">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-4">
                <span className="text-3xl font-bold text-emerald-600">
                  {plan.price}
                </span>

                <p className="text-white mt-1">
                  {plan.credits} Credits
                </p>
              </div>

              {/* Description */}
              <p className="text-blue-200 mt-4 text-sm leading-relaxed">
                {plan.description}
              </p>

              {/* Features */}
              <div className="mt-6 space-y-6 text-left">
                {plan.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3"
                  >
                    <FaCheckCircle className="text-emerald-500 text-sm" />

                    <span className="text-white text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Payment Button */}
              {!plan.default && (
                <button
                  disabled={loadingPlan === plan.id}
                  onClick={(e) => {
                    e.stopPropagation();

                    if (!isSelected) {
                      setSelectedPlan(plan.id);
                    } else {
                      handlePayment(plan);
                    }
                  }}
                  className={`w-full mt-8 py-3 rounded-xl font-semibold
                  text-white
                  bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900
                  border border-blue-500/40
                  shadow-[0_0_15px_rgba(59,130,246,0.15)]
                  hover:from-slate-700 hover:via-blue-800 hover:to-indigo-800
                  hover:border-blue-400/60
                  hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]
                  hover:-translate-y-0.5
                  active:translate-y-0
                  transition-all duration-300
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  ${
                    isSelected
                      ? "ring-1 ring-blue-400/50"
                      : ""
                  }`}
                >
                  {loadingPlan === plan.id
                    ? "Processing..."
                    : isSelected
                    ? "Proceed to Pay →"
                    : "Select Plan →"}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Pricing;
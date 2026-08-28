import React from "react";
import { RiRobot3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05051A] via-[#17104A] to-[#9D174D] flex items-center justify-center px-4">

      <div className="w-full max-w-2xl bg-[#0b0925]/90 border border-fuchsia-500/30 rounded-3xl p-8 md:p-12 shadow-2xl shadow-fuchsia-950/40">

        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-fuchsia-500/10 text-fuchsia-300">
            <RiRobot3Fill size={28} />
          </div>

          <h1 className="text-2xl font-bold text-white">
            Contact <span className="text-fuchsia-400">Us</span>
          </h1>
        </div>

        <p className="text-slate-300 text-center mb-8">
          Have a question, feedback, or need help with Intervia.AI?
          We'd love to hear from you.
        </p>

        <div className="space-y-4">

          <div className="bg-white/5 border border-fuchsia-500/10 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Email</p>
            <p className="text-white font-medium mt-1">
              support@intervia.ai
            </p>
          </div>

          <div className="bg-white/5 border border-fuchsia-500/10 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Response Time</p>
            <p className="text-white font-medium mt-1">
              We usually respond within 24–48 hours.
            </p>
          </div>

        </div>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="text-fuchsia-300 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Contact;

import React, { useState } from "react";
import { RiRobot3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus("");

    try {
      const response = await fetch(
  "https://intervia-b9ld.onrender.com/api/contact",
  {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setStatus("success");

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05051A] via-[#17104A] to-[#9D174D] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-2xl bg-[#0b0925]/90 border border-fuchsia-500/30 rounded-3xl p-8 md:p-12 shadow-2xl shadow-fuchsia-950/40">

        {/* Header */}
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

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-fuchsia-500/20 text-white placeholder-slate-500 outline-none focus:border-fuchsia-400 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-fuchsia-500/20 text-white placeholder-slate-500 outline-none focus:border-fuchsia-400 transition"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Message
            </label>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              rows="5"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-fuchsia-500/20 text-white placeholder-slate-500 outline-none focus:border-fuchsia-400 transition resize-none"
            />
          </div>

          {/* Status */}
          {status === "success" && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl p-3 text-center">
              Message sent successfully! We'll get back to you soon.
            </div>
          )}

          {status === "error" && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-center">
              Failed to send message. Please try again.
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

        </form>

        {/* Email */}
        <div className="space-y-4 mt-8">

          <div className="bg-white/5 border border-fuchsia-500/10 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Email</p>

            <p className="text-white font-medium mt-1">
              contact@intervia.me
            </p>
          </div>

          <div className="bg-white/5 border border-fuchsia-500/10 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Response Time</p>

            <p className="text-white font-medium mt-1">
              We usually respond within 24–48 hours.
            </p>
          </div>

        </div>

        {/* Back */}
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
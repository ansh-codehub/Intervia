import React, { useState } from "react";
import { RiRobot3Fill } from "react-icons/ri";
import { IoSparklesSharp } from "react-icons/io5";
import { motion } from "motion/react";
import { ImGoogle } from "react-icons/im";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Auth({ isModel = false }) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const response = await signInWithPopup(auth, provider);

      const user = response.user;

      const result = await axios.post(
        `${ServerUrl}/api/auth/google`,
        {
          name: user.displayName,
          email: user.email,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(setUserData(result.data));
    } catch (error) {
      console.error("Google Auth Error:", error);

      if (error.code === "auth/popup-blocked") {
        alert(
          "Google login popup was blocked. Please allow popups for localhost and try again."
        );
      } else if (error.code === "auth/popup-closed-by-user") {
        console.log("Google login popup was closed.");
      } else {
        console.error(error);
      }

      dispatch(setUserData(null));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full ${isModel
          ? "py-4"
          : "min-h-screen bg-[#0b0920] flex items-center justify-center px-6 py-20 relative overflow-hidden"
        }`}
    >
      {/* Background Glow */}
      {!isModel && (
        <>
          <div className="absolute top-[-180px] left-[10%] w-[450px] h-[450px] bg-purple-700/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-180px] right-[5%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[150px]" />
          <div className="absolute top-[20%] right-[-150px] w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[140px]" />
        </>
      )}

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className="relative w-full max-w-md p-8 md:p-10 rounded-3xl
        bg-[#15112f]/95
        border border-fuchsia-500/30
        shadow-[0_0_50px_rgba(168,85,247,0.15)]"
      >
        {/* Top Gradient Glow */}
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent" />

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-7">
          <div
            className="bg-gradient-to-br from-purple-600 to-pink-600
            text-white p-3 rounded-xl
            shadow-[0_0_20px_rgba(217,70,239,0.35)]"
          >
            <RiRobot3Fill size={20} />
          </div>

          <h2 className="font-semibold text-lg text-white">
            Intervia.Ai
          </h2>
        </div>

        {/* Heading */}
        <h1
          className="text-2xl md:text-3xl font-semibold text-center
          leading-snug mb-5 text-white"
        >
          Continue with{" "}
          <span
            className="bg-gradient-to-r from-purple-600/20 via-fuchsia-500/20 to-pink-600/20
            border border-fuchsia-500/30
            text-fuchsia-200
            px-3 py-1.5 rounded-full
            inline-flex items-center gap-2
            shadow-[0_0_20px_rgba(217,70,239,0.1)]"
          >
            <IoSparklesSharp
              size={16}
              className="text-fuchsia-400"
            />
            AI Smart Interview
          </span>
        </h1>

        {/* Description */}
        <p
          className="text-slate-400 text-center text-sm md:text-base
          leading-relaxed mb-8"
        >
          Sign in to start your AI-powered mock interview.
        </p>

        {/* Google Button */}
        <motion.button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          whileHover={!loading ? { opacity: 0.9, scale: 1.03 } : {}}
          whileTap={!loading ? { opacity: 1, scale: 0.98 } : {}}
          className={`w-full flex items-center justify-center gap-3
    py-3.5 rounded-full
    font-semibold
    border transition-all duration-300
    ${loading
              ? "bg-slate-700 text-slate-400 border-slate-600 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white border-fuchsia-400/40 shadow-[0_0_25px_rgba(217,70,239,0.25)] hover:shadow-[0_0_35px_rgba(217,70,239,0.4)]"
            }`}
        >
          <ImGoogle size={20} />

          {loading ? "Signing in..." : "Continue with Google"}
        </motion.button>

        {/* Bottom subtle text */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Secure authentication powered by Google
        </p>
      </motion.div>
    </div>
  );
}

export default Auth;
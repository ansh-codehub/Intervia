import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkRichtext,
  BsFileEarmarkText,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import AuthModel from "../components/AuthModel";
import { useNavigate } from "react-router-dom";
import evalImg from "../assets/ai-ans.png"
import analytics from "../assets/history.png"
import congiImg from "../assets/confi.png"
import creditImg from "../assets/credit.png"
import resumeImg from "../assets/resume.png"
import pdfImg from "../assets/pdf.png"
import hrImg from "../assets/HR.png"
import techImg from "../assets/tech.png"
import Footer from "../components/Footer";









function Home() {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const steps = [
    {
      icon: <BsRobot size={28} />,
      step: "STEP 1",
      title: "Role & Experience Selection",
      desc: "AI adjusts interview questions based on your selected job role and experience level.",
    },
    {
      icon: <BsMic size={28} />,
      step: "STEP 2",
      title: "Smart Voice Interview",
      desc: "Answer questions naturally while AI asks intelligent follow-up questions in real time.",
    },
    {
      icon: <BsClock size={28} />,
      step: "STEP 3",
      title: "Timed Interview Simulation",
      desc: "Experience realistic interview pressure with countdown timers and instant evaluation.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05051A] via-[#17104A] to-[#9D174D] flex flex-col">
      <Navbar />

      <div className="flex-1 px-6 py-20">
        <div className="max-w-6xl mx-auto">

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#17104A]/80 border border-fuchsia-500/30 text-fuchsia-100 text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-fuchsia-950/30">
              <HiSparkles size={16} className="text-fuchsia-400" />
              AI Powered Smart Interview Platform
            </div>
          </div>

          {/* Hero */}
          <div className="text-center mb-28">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold leading-tight max-w-5xl mx-auto text-white"
            >
              Practice Interviews With{" "}
              <span className="inline-block bg-gradient-to-r from-[#17104A] to-[#9D174D] text-fuchsia-100 px-5 py-2 rounded-full mt-2 border border-fuchsia-400/20 shadow-lg shadow-fuchsia-950/30">
                Intervia (AI Intelligence)
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-slate-300 mt-6 max-w-2xl mx-auto text-lg"
            >
              Role-based mock interviews with smart follow-up questions,
              adaptive difficulty, and real-time performance evaluation.
            </motion.p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">

              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/interview");
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="bg-gradient-to-r from-[#17104A] to-[#9D174D] text-white font-semibold px-10 py-3 rounded-full shadow-lg shadow-fuchsia-950/40 hover:from-[#261B69] hover:to-[#BE185D] transition border border-fuchsia-500/20"
              >
                Start Interview
              </motion.button>

              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/history");
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="bg-[#17104A] border border-fuchsia-500/30 text-fuchsia-100 font-semibold px-10 py-3 rounded-full shadow-lg shadow-fuchsia-950/30 hover:bg-[#261B69] hover:border-fuchsia-400/50 transition"
              >
                View History
              </motion.button>

            </div>
          </div>

          {/* Cards */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-10">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 + index * 0.2 }}
                whileHover={{
                  scale: 1.05,
                  rotate: 0,
                  y: -8,
                }}
                className={`relative bg-gradient-to-br from-[#17104A] to-[#05051A] rounded-3xl border-2 border-fuchsia-900/50 hover:border-fuchsia-500/70
              pt-16 pb-8 px-8 w-80 shadow-lg shadow-fuchsia-950/20 hover:shadow-2xl hover:shadow-fuchsia-950/40 transition-all duration-300
              ${index === 0 ? "rotate-[-4deg]" : ""}
              ${index === 1 ? "rotate-[3deg] md:-mt-6" : ""}
              ${index === 2 ? "rotate-[-3deg]" : ""}`}
              >

                {/* Floating Icon */}
                <div
                  className="absolute -top-8 left-1/2 -translate-x-1/2
                w-16 h-16 rounded-2xl bg-gradient-to-br from-[#17104A] to-[#9D174D] border-2 border-fuchsia-400/40
                flex items-center justify-center text-fuchsia-200 shadow-lg shadow-fuchsia-950/40"
                >
                  {item.icon}
                </div>

                {/* Card Content */}
                <div className="text-center">

                  <p className="text-xs font-bold tracking-[3px] text-fuchsia-400 mb-2">
                    {item.step}
                  </p>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {item.title}
                  </h3>

                  <p className="text-slate-300 leading-7 text-sm">
                    {item.desc}
                  </p>

                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 mb-32">

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-semibold text-center mb-16 text-white"
            >
              Advanced AI{" "}
              <span className="text-fuchsia-400">Capabilities</span>
            </motion.h2>


            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  image: evalImg,
                  icon: <BsBarChart size={20} />,
                  title: "AI Answer Evaluation",
                  desc: "Scores communication, technical accuracy and confidence",
                },
                {
                  image: resumeImg,
                  icon: <BsFileEarmarkText size={20} />,
                  title: "Resume Based Interviews",
                  desc: "Project-specific questions based on uploaded resume",
                },
                {
                  image: pdfImg,
                  icon: <BsFileEarmarkText size={20} />,
                  title: "Downloadable PDF Report",
                  desc: "Detailed strengths, weaknesses and improvement insights",
                },
                {
                  image: analytics,
                  icon: <BsBarChart size={20} />,
                  title: "Detailed Performance Report",
                  desc: "Get actionable feedback and personalized improvement insights",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  viewport={{ once: true }}
                  className="
        bg-gradient-to-br from-[#17104A] to-[#05051A]
        border border-fuchsia-900/50
        rounded-3xl
        p-8
        shadow-sm
        shadow-fuchsia-950/20
        hover:shadow-xl
        hover:shadow-fuchsia-950/40
        hover:border-fuchsia-500/40
        transition-all duration-300
      "
                >
                  <div className="flex flex-col md:flex-row items-center gap-8">

                    {/* Image */}
                    <div className="w-full md:w-1/2 flex justify-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-auto object-contain max-h-64"
                      />
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-1/2">

                      {/* Icon */}
                      <div
                        className="
              bg-gradient-to-br from-[#17104A] to-[#9D174D]
              text-fuchsia-300
              w-12 h-12
              rounded-xl
              flex items-center justify-center
              mb-6
              border border-fuchsia-500/30
              shadow-lg shadow-fuchsia-950/30
            "
                      >
                        {item.icon}
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold mb-3 text-xl text-white">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {item.desc}
                      </p>

                    </div>
                  </div>
                </motion.div>
              ))}
            </div>




          </div>

          <div className="mt-8 mb-32">

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-semibold text-center mb-16 text-white"
            >
              Multiple Interviews{" "}
              <span className="text-fuchsia-400">Modes</span>
            </motion.h2>


            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  image: hrImg,
                  title: "HR Interview Mode",
                  desc: "Behavioral and communication based evaluation",
                },
                {
                  image: techImg,
                  title: "Technical Mode",
                  desc: "Deep technical questioning based on selected role",
                },
                {
                  image: congiImg,
                  title: "Confidence Detecting",
                  desc: "Basic tone and voice analysis insights",
                },
                {
                  image: creditImg,
                  title: "Credits System",
                  desc: "Unlock premium interview sessions easily",
                },
              ].map((mode, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  viewport={{ once: true }}
                  className="
        bg-gradient-to-br from-[#17104A] to-[#9D174D]/70
        border border-fuchsia-900/50
        rounded-3xl
        p-8
        shadow-sm
        shadow-fuchsia-950/20
        hover:shadow-xl
        hover:shadow-fuchsia-950/40
        hover:border-fuchsia-500/40
        transition-all duration-300
      "
                >
                  <div className="flex items-center justify-between gap-6">

                    <div className="w-1/2">

                      <h3 className="font-semibold text-xl mb-3 text-white">
                        {mode.title}
                      </h3>

                      <p className="text-slate-300 text-sm leading-relaxed">
                        {mode.desc}
                      </p>

                    </div>

                    <div className="w-1/2 flex justify-end">
                      <img
                        src={mode.image}
                        alt={mode.title}
                        className="w-28 h-28 object-contain"
                      />
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>




          </div>


        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      <Footer/>

    </div>
  );
}

export default Home;
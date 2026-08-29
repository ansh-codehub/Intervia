import React, { useState } from "react";
import { motion } from "motion/react";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const ServerUrl = "https://api.intervia.me";

function Setup({ onStart }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");

  const [resume, setResume] = useState(null);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);

  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // =========================================================
  // HANDLE RESUME CHANGE
  // =========================================================

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Check PDF
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Please upload a PDF file.");
      e.target.value = "";
      return;
    }

    setResume(file);

    // Clear old analysis
    setResumeAnalysis(null);
  };

  // =========================================================
  // ANALYZE RESUME
  // =========================================================

  const handleAnalyzeResume = async () => {
    if (!resume) {
      alert("Please upload a resume first.");
      return;
    }

    try {
      setAnalyzing(true);

      const formData = new FormData();
      formData.append("resume", resume);

      const response = await fetch(
        `${ServerUrl}/api/interview/resume`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid response received from server.");
      }

      console.log("Resume analysis response:", data);

      if (!response.ok) {
        throw new Error(
          data?.message ||
          data?.error ||
          "Resume analysis failed."
        );
      }

      setResumeAnalysis(data);

      // Auto-fill role
      if (data?.role) {
        setRole(data.role);
      }

      // Auto-fill experience
      if (data?.experience) {
        setExperience(data.experience);
      }

      console.log("Resume analysis successful.");
    } catch (error) {
      console.error("Resume analysis error:", error);

      alert(
        error?.message ||
        "Unable to analyze resume. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // =========================================================
  // START INTERVIEW
  // =========================================================

  const handleStart = async () => {
    if (!role.trim()) {
      alert("Please enter your job role.");
      return;
    }

    if (!experience) {
      alert("Please select your experience level.");
      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      const resumeText =
        resumeAnalysis?.resumeText || "";

      const projects = Array.isArray(
        resumeAnalysis?.projects
      )
        ? resumeAnalysis.projects
        : [];

      const skills = Array.isArray(
        resumeAnalysis?.skills
      )
        ? resumeAnalysis.skills
        : [];

      const payload = {
        role: role.trim(),
        experience,
        mode,
        resumeText,
        projects,
        skills,
      };

      console.log(
        "Sending interview request:",
        payload
      );

      const result = await axios.post(
        `${ServerUrl}/api/interview/generate-questions`,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 120000,
        }
      );

      console.log(
        "Interview response:",
        result.data
      );

      if (!result.data) {
        throw new Error(
          "Empty response received from server."
        );
      }

      if (
        userData &&
        result.data.creditsLeft !== undefined
      ) {
        dispatch(
          setUserData({
            ...userData,
            credits: result.data.creditsLeft,
          })
        );
      }

      onStart(result.data);

    } catch (error) {
      console.error(
        "================================"
      );
      console.error(
        "START INTERVIEW ERROR"
      );
      console.error(
        "================================"
      );

      if (error.response) {
        console.error(
          "Status:",
          error.response.status
        );

        console.error(
          "Backend response:",
          JSON.stringify(error.response.data, null, 2)
        );

        console.error(
          "Headers:",
          error.response.headers
        );

        const backendMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Server error occurred.";

        alert(
          `Server Error (${error.response.status}): ${backendMessage}`
        );

      } else if (error.request) {
        console.error(
          "Request:",
          error.request
        );

        alert(
          "No response from server. Make sure your backend is running on port 8000."
        );

      } else {
        console.error(
          "Error message:",
          error.message
        );

        alert(
          error.message ||
          "Unable to start interview."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05051A] via-[#17104A] to-[#9D174D] px-4 py-10"
    >
      <div className="w-full max-w-6xl bg-[#0B0825]/95 border border-purple-800/40 rounded-3xl shadow-2xl shadow-purple-950/50 grid md:grid-cols-2 overflow-hidden">

        {/* =====================================================
            LEFT SECTION
        ===================================================== */}

        <motion.div
          initial={{
            x: -80,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          whileHover={{
            scale: 1.01,
          }}
          className="relative overflow-hidden bg-gradient-to-br from-[#05051A] via-[#17104A] to-[#4C164C] p-10 md:p-12 lg:p-14 flex flex-col justify-center text-white"
        >
          {/* Pink Glow */}

          <motion.div
            animate={{
              x: [0, 40, 0],
              y: [0, 25, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-32 -left-32 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"
          />

          {/* Magenta Glow */}

          <motion.div
            animate={{
              x: [0, -35, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] bg-fuchsia-600/10 rounded-full blur-3xl"
          />

          {/* Center Glow */}

          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          />

          {/* Content */}

          <div className="relative z-10 max-w-xl">

            {/* Badge */}

            <motion.div
              initial={{
                opacity: 0,
                y: -15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.25,
                duration: 0.5,
              }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-400/20 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />

              <span className="text-pink-300 text-sm font-medium">
                AI-Powered Interview
              </span>
            </motion.div>

            {/* Heading */}

            <motion.h2
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
                duration: 0.7,
                ease: "easeOut",
              }}
              className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold tracking-tight leading-[1.08] mb-6"
            >
              Start Your

              <span className="block mt-2 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
                AI Interview
              </span>
            </motion.h2>

            {/* Description */}

            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.6,
                duration: 0.6,
              }}
              className="text-purple-200/80 text-base md:text-lg leading-relaxed max-w-lg mb-9"
            >
              Practice realistic interview scenarios
              powered by AI. Improve your communication,
              technical skills, and confidence with every
              interview.
            </motion.p>

            {/* Features */}

            <div className="space-y-3.5">
              {[
                {
                  icon: <FaUserTie />,
                  text: "Choose Role & Experience",
                },
                {
                  icon: <FaMicrophoneAlt />,
                  text: "Smart Voice Interview",
                },
                {
                  icon: <FaChartLine />,
                  text: "Performance Analytics",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{
                    y: 25,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    delay:
                      0.75 + index * 0.12,
                    duration: 0.5,
                  }}
                  whileHover={{
                    x: 6,
                    scale: 1.02,
                  }}
                  className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-pink-400/[0.08] backdrop-blur-md shadow-lg cursor-pointer transition-all duration-300 hover:bg-white/[0.07] hover:border-pink-400/20"
                >
                  <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 border border-pink-400/20 text-pink-300 text-lg">
                    {item.icon}
                  </div>

                  <span className="text-purple-100 font-medium text-sm md:text-base">
                    {item.text}
                  </span>

                  <span className="ml-auto text-purple-700 group-hover:text-pink-400">
                    →
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Bottom Accent */}

            <motion.div
              initial={{
                width: 0,
                opacity: 0,
              }}
              animate={{
                width: "100%",
                opacity: 1,
              }}
              transition={{
                delay: 1.2,
                duration: 0.8,
              }}
              className="mt-8 h-px bg-gradient-to-r from-pink-500/40 via-fuchsia-500/20 to-transparent"
            />
          </div>
        </motion.div>

        {/* =====================================================
            RIGHT SECTION
        ===================================================== */}

        <motion.div
          initial={{
            x: 80,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.7,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="relative bg-gradient-to-br from-[#0B0825] via-[#17104A] to-[#16091F] p-8 md:p-10 lg:p-12 flex flex-col justify-center"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl" />

          <div className="relative z-10">

            {/* Header */}

            <div className="mb-8">
              <p className="text-pink-400 text-sm font-semibold uppercase tracking-wider mb-2">
                Get Started
              </p>

              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Interview Setup
              </h2>

              <p className="text-purple-200/60 mt-2 text-sm">
                Configure your interview before you begin.
              </p>
            </div>

            {/* =================================================
                ROLE
            ================================================= */}

            <div className="mb-5">
              <label className="block text-sm font-medium text-purple-100/80 mb-2">
                Job Role
              </label>

              <div className="relative">
                <FaUserTie className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/50" />

                <input
                  type="text"
                  placeholder="e.g. Frontend Developer"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value)
                  }
                  className="w-full bg-[#11102F]/80 border border-purple-800/50 text-white placeholder:text-purple-300/30 rounded-xl py-3.5 pl-11 pr-4 outline-none transition-all duration-300 focus:border-pink-500/70 focus:ring-2 focus:ring-pink-500/10 hover:border-purple-700"
                />
              </div>
            </div>

            {/* =================================================
                EXPERIENCE
            ================================================= */}

            <div className="mb-5">
              <label className="block text-sm font-medium text-purple-100/80 mb-2">
                Experience Level
              </label>

              <div className="relative">
                <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/50 pointer-events-none" />

                <select
                  value={experience}
                  onChange={(e) =>
                    setExperience(e.target.value)
                  }
                  className="w-full appearance-none bg-[#11102F]/80 border border-purple-800/50 text-white rounded-xl py-3.5 pl-11 pr-10 outline-none cursor-pointer transition-all duration-300 focus:border-pink-500/70 focus:ring-2 focus:ring-pink-500/10"
                >
                  <option
                    value=""
                    className="bg-[#11102F]"
                  >
                    Select experience
                  </option>

                  <option
                    value="Fresher"
                    className="bg-[#11102F]"
                  >
                    Fresher
                  </option>

                  <option
                    value="0-2 Years"
                    className="bg-[#11102F]"
                  >
                    0 - 2 Years
                  </option>

                  <option
                    value="2-5 Years"
                    className="bg-[#11102F]"
                  >
                    2 - 5 Years
                  </option>

                  <option
                    value="5+ Years"
                    className="bg-[#11102F]"
                  >
                    5+ Years
                  </option>
                </select>
              </div>
            </div>

            {/* =================================================
                INTERVIEW MODE
            ================================================= */}

            <div className="mb-6">
              <label className="block text-sm font-medium text-purple-100/80 mb-2">
                Interview Mode
              </label>

              <div className="grid grid-cols-2 gap-3">
                {["Technical", "HR"].map(
                  (item) => (
                    <motion.button
                      key={item}
                      type="button"
                      whileTap={{
                        scale: 0.97,
                      }}
                      onClick={() =>
                        setMode(item)
                      }
                      className={`
                        py-3.5
                        rounded-xl
                        border
                        font-medium
                        text-sm
                        transition-all duration-300
                        ${mode === item
                          ? "bg-pink-500/15 border-pink-500/50 text-pink-300 shadow-lg shadow-pink-500/5"
                          : "bg-white/[0.03] border-purple-800/50 text-purple-300/60 hover:bg-white/[0.05] hover:text-purple-100"
                        }
                      `}
                    >
                      {item}
                    </motion.button>
                  )
                )}
              </div>
            </div>

            {/* =================================================
                RESUME
            ================================================= */}

            <div className="mb-6">
              <label className="block text-sm font-medium text-purple-100/80 mb-2">
                Resume
              </label>

              <motion.div
                whileHover={{
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.99,
                }}
                onClick={() =>
                  document
                    .getElementById(
                      "resumeUpload"
                    )
                    ?.click()
                }
                className="border-2 border-dashed border-purple-800/60 hover:border-pink-500/50 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 bg-white/[0.02] hover:bg-pink-500/[0.03]"
              >
                <FaFileUpload className="text-3xl mx-auto text-pink-400 mb-3" />

                <p className="text-purple-100 text-sm font-medium truncate px-2">
                  {resume
                    ? resume.name
                    : "Upload your resume"}
                </p>

                <p className="text-purple-300/40 text-xs mt-1">
                  PDF files only
                </p>

                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  id="resumeUpload"
                  className="hidden"
                  onChange={
                    handleResumeChange
                  }
                />
              </motion.div>

              {/* Analyze */}

              {resume && (
                <motion.button
                  type="button"
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={
                    handleAnalyzeResume
                  }
                  disabled={analyzing}
                  className="w-full mt-3 py-3 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300 font-semibold hover:bg-pink-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {analyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-pink-300/30 border-t-pink-300 rounded-full animate-spin" />
                      Analyzing Resume...
                    </span>
                  ) : (
                    "Analyze Resume"
                  )}
                </motion.button>
              )}
            </div>

            {/* =================================================
                RESUME ANALYSIS
            ================================================= */}

            {resumeAnalysis && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
                className="mb-6 p-5 rounded-xl bg-white/[0.03] border border-purple-800/50"
              >
                <h3 className="text-white font-semibold mb-4">
                  Resume Analysis Result
                </h3>

                {/* Projects */}

                {Array.isArray(
                  resumeAnalysis.projects
                ) &&
                  resumeAnalysis.projects
                    .length > 0 && (
                    <div className="mb-4">
                      <p className="text-purple-100/80 text-sm font-medium mb-2">
                        Projects:
                      </p>

                      <ul className="list-disc list-inside space-y-1">
                        {resumeAnalysis.projects.map(
                          (
                            project,
                            index
                          ) => (
                            <li
                              key={index}
                              className="text-purple-200/60 text-sm"
                            >
                              {project}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {/* Skills */}

                {Array.isArray(
                  resumeAnalysis.skills
                ) &&
                  resumeAnalysis.skills
                    .length > 0 && (
                    <div>
                      <p className="text-purple-100/80 text-sm font-medium mb-2">
                        Skills:
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {resumeAnalysis.skills.map(
                          (
                            skill,
                            index
                          ) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </motion.div>
            )}

            {/* =================================================
                START INTERVIEW
            ================================================= */}

            <motion.button
              type="button"
              whileHover={{
                scale: loading
                  ? 1
                  : 1.02,
              }}
              whileTap={{
                scale: loading
                  ? 1
                  : 0.98,
              }}
              disabled={
                loading ||
                !role.trim() ||
                !experience
              }
              onClick={handleStart}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-gradient-to-r from-[#7E174D] via-[#9D174D] to-[#BE185D] text-white font-semibold shadow-lg shadow-pink-950/30 transition-all duration-300 hover:from-[#9D174D] hover:via-[#BE185D] hover:to-[#DB2777] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Interview...
                </>
              ) : (
                <>
                  Start Interview
                  <FaArrowRight className="text-sm" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Setup;
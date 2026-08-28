import React, { useEffect, useRef, useState } from "react";

import maleVideo from "../assets/videos/male-ai.mp4";

import femaleVideo from "../assets/videos/female-ai.mp4";

import Timer from "./Timer";

import { motion, time } from "motion/react";

import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

import axios from "axios";

import { ServerUrl } from "../App";

import { current } from "@reduxjs/toolkit";

import { BsArrowRight } from "react-icons/bs";









function Interview({ interviewData, onFinish }) {

  const { interviewId, questions, userName} = interviewData;

  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);

  const recognitionRef = useRef(null);

  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentInder, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");

  const [feedback, setFeedback] = useState("");

  const [timeLeft, setTimeLeft] = useState(

    questions[0]?.timeLimit || 60

  );

  const [selectedVoice, setselectedVoice] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [voiceGender, setVoiceGender] = useState("female");

  const [subtitle, setSubtitle] = useState("");

  const videoref = useRef(null);

  const currentQuestion = questions[currentInder];





  useEffect(() => {

    const loadVoices = () => {

      const voices = window.speechSynthesis.getVoices();

      if (!voices.length) return;

      const femaleVoice =

        voices.find(v =>

          v.name.toLowerCase().includes("zira") ||

          v.name.toLowerCase().includes("samantha") ||

          v.name.toLowerCase().includes("female")

        );

      if (femaleVoice) {

        setselectedVoice(femaleVoice);

        setVoiceGender("female");

        return;

      }

      const maleVoice =

        voices.find(v =>

          v.name.toLowerCase().includes("david") ||

          v.name.toLowerCase().includes("mark") ||

          v.name.toLowerCase().includes("male")

        );

      if (maleVoice) {

        setselectedVoice(maleVoice);

        setVoiceGender("male");

        return;

      }

      setselectedVoice(voices[0]);

      setVoiceGender("female");

    };

    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;

  }, [])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  /* speak */

  const speakText = (text) => {

    return new Promise((resolve) => {

      if (!window.speechSynthesis || !selectedVoice) {

        resolve();

        return;

      }

      window.speechSynthesis.cancel();

      const humanText = text

        .replace(/,/g, ",... ")

        .replace(/\,/g, ",... ");

      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;

      utterance.rate = 0.92;

      utterance.pitch = 1.05;

      utterance.volume = 1;

      utterance.onstart = () => {

        setIsAIPlaying(true);

        stopMic();

        videoref.current?.play();

      };

      utterance.onend = () => {

        videoref.current?.pause();

        videoref.current.currentTime = 0;

        setIsAIPlaying(false);

        if (isMicOn) {

          startMic();

        }

        setTimeout(() => {

          setSubtitle("");

          resolve();

        }, 300);

      };

      setSubtitle(text);

      window.speechSynthesis.speak(utterance);

    });

  };

  useEffect(() => {

    if (!selectedVoice) {

      return;

    }

    const runIntro = async () => {

      if (isIntroPhase) {

        await speakText(

          `Hi ${userName}, it's a pleasure to meet you today. 

          I hope you're feeling confident and prepared.`

        );

        await speakText(

          `I'll ask you a few questions. Please answer naturally and take your time. 

           Let's begin.`

        );

        setIsIntroPhase(false);

      }else if(currentQuestion){

        await new Promise(r => setTimeout(r, 800));

        if (currentInder === questions.length - 1) {

          await speakText("Alright, this one might be a bit more challenging.");

        }

        await speakText(currentQuestion.question);

        if (isMicOn) {

          startMic();

        }

      }

    }

    runIntro();

  }, [selectedVoice, isIntroPhase, currentInder])

  useEffect(() => {

    if(isIntroPhase) return;

    if(!currentQuestion) return;

    const timer = setInterval(() => {

      setTimeLeft((prev)=>{

        if(prev <= 1){

          clearInterval(timer)

          return 0;

        }

        return prev - 1;

      })

    }, 1000);

    return () => clearInterval(timer);

  },[isIntroPhase, currentInder])

  useEffect(() => {

    if (!isIntroPhase && currentQuestion) {

      setTimeLeft(currentQuestion.timeLimit || 60);

    }

  },[currentInder]);

  useEffect(() => {

    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();

    recognition.lang = "en-us";

    recognition.continuous = true;

    recognition.interimResults = false;

    recognition.onresult = (event) => {

      const transcript = 

      event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => prev + " " + transcript);

    };

    recognitionRef.current = recognition;

  },[])

  const startMic = () => {

    if (recognitionRef.current && !isAIPlaying) {

      try {

        recognitionRef.current.start();

      } catch  {

      }

    }

  };

  const stopMic = () => {

    if (recognitionRef.current) {

      recognitionRef.current.stop();

    }

  };

  const toggleMic = () => {

    if (isMicOn) {

      stopMic();

    } else {

      startMic();

    }

    setIsMicOn(!isMicOn);

  };

  const submitAnswer = async () => {

    if(isSubmitting) return;

    stopMic();

    setIsSubmitting(true);

    try {

      const result = await axios.post(ServerUrl + "/api/interview/submit-answer",

        {

          interviewId,

          questionIndex: currentInder,

          answer,

          timeTaken: currentQuestion.timeLimit - timeLeft

        },

        {withCredentials:true}

      )

      setFeedback(result.data.feedback)

      speakText(result.data.feedback)

      setIsSubmitting(false)

    } catch (error) {

      console.log(error)

      setIsSubmitting(false);

    }

  }

  const handleNext = async () => {

    setAnswer("");

    setFeedback("");

    if (currentInder + 1 >= questions.length) {

      finishInterview();

      return;

    }

    await speakText("Alright, let's move to the next question.");

    setCurrentIndex(currentInder + 1);

    setTimeout(() => {

      if (isMicOn) startMic();

    }, 500);

  }

  const finishInterview = async () => {

    stopMic();

    setIsMicOn(false);

    try {

      const result = await axios.post(ServerUrl + "/api/interview/finish", {

        interviewId

      }, {withCredentials:true})

      console.log(result.data)

      onFinish(result.data)

    } catch (error) {

      console.log(error)

    }

  }

  useEffect(() => {

    if(isIntroPhase) return;

    if(!currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {

      submitAnswer();

    }

  },[timeLeft]);

  useEffect(() => {

    return () => {

      if (recognitionRef.current) {

        recognitionRef.current.stop();

        recognitionRef.current.abort();

      }

      window.speechSynthesis.cancel();

    };

  },[]);









  return (

    <div className="min-h-screen bg-gradient-to-br from-[#05051A] via-[#17104A] to-[#9D174D] flex items-center justify-center p-4 sm:p-6">

      <div className="w-full max-w-[1400px] min-h-[80vh] bg-gradient-to-br from-[#0B0825] via-[#17104A] to-[#12091F] rounded-3xl overflow-hidden flex border border-purple-800/60 shadow-2xl shadow-purple-950/50">

        {/* Left Side - AI Video */}

        <div className="w-full lg:w-[35%] bg-gradient-to-b from-[#0B0825] via-[#17104A] to-[#05051A] flex flex-col items-center p-6 space-y-6 border-r border-purple-800/60">

          {/* Video */}

          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl shadow-purple-950/60 border border-purple-800/50">

            <video

              src={videoSource}

              key={videoSource}

              ref={videoref}

              muted

              playsInline

              preload="auto"

              className="w-full h-auto object-cover"

            />

          </div>

          {/* Subtitle */}

          {subtitle && (

            <div className="w-full max-w-md bg-[#0B0825]/90 border border-purple-700/60 rounded-xl p-4 shadow-lg shadow-purple-950/30 backdrop-blur-sm">

              <p className="text-purple-100 text-sm sm:text-base font-medium text-center leading-relaxed">

                {subtitle}

              </p>

            </div>

          )}

          {/* Interview Status + Timer */}

          <div className="w-full max-w-md bg-gradient-to-br from-[#0B0825] to-[#17104A]/80 border border-purple-800/60 rounded-2xl shadow-xl shadow-purple-950/40 p-6 space-y-5">

            <div className="flex justify-between items-center">

              <span className="text-sm text-purple-200/60">

                Interview Status

              </span>

              {isAIPlaying && (

                <span className="text-sm font-semibold text-pink-400">

                  {isAIPlaying ? "AI Speaking" : ""}

                </span>

              )}

            </div>

            <div className="h-px bg-purple-800/60"></div>

            {/* Timer */}

            <div className="flex justify-center">

              <Timer

                timeLeft={timeLeft}

                totalTime={currentQuestion?.

                  timeLimit 

                }

              />

            </div>

            <div className="h-px bg-purple-800/60"></div>

            {/* Question Counter */}

            <div className="grid grid-cols-2 gap-6 text-center">

              <div>

                <span className="text-2xl font-bold text-pink-400 block">

                  {currentInder + 1}

                </span>

                <span className="text-xs text-purple-300/50">

                  Current Question

                </span>

              </div>

              <div>

                <span className="text-2xl font-bold text-pink-400 block">

                  10

                </span>

                <span className="text-xs text-purple-300/50">

                  Total Question

                  {/* {questions.length} */}

                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Right Side - Interview Question */}

        <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative bg-gradient-to-br from-[#0B0825] via-[#17104A]/70 to-[#240A25]/60">

          <h2 className="text-xl sm:text-2xl font-bold text-pink-400 mb-6">

            AI Smart Interview

          </h2>

          {!isIntroPhase && (

            <div className="relative mb-6 bg-gradient-to-br from-[#11102F]/90 to-[#17104A]/80 p-4 sm:p-6 rounded-2xl border border-purple-800/60 shadow-lg shadow-purple-950/30">

              <p className="text-xs sm:text-sm text-pink-400 mb-2">

                Question {currentInder + 1} of {questions.length}

              </p>

              <div className="text-base sm:text-lg font-semibold text-white leading-relaxed pr-16">

                {currentQuestion?.question}

              </div>

            </div>

          )}

          <textarea

            placeholder="Type your answer here..."

            onChange={(e)=>setAnswer(e.target.value)}

            value={answer}

            className="flex-1 bg-[#11102F]/80 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-purple-800/60 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition text-purple-50 placeholder:text-purple-300/40 shadow-inner shadow-purple-950/30"

          />

          {!feedback ? (

            <div className="flex items-center gap-4 mt-6">

              <motion.button

                onClick={toggleMic}

                whileTap={{ scale: 0.9 }}

                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#11102F] to-[#4C164C] text-pink-300 border border-purple-700/60 shadow-lg shadow-purple-950/50 hover:from-[#4C164C] hover:to-[#7E174D] transition"

              >

                {isMicOn ? <FaMicrophone size={20} /> 

                : <FaMicrophoneSlash size={20}/>}

              </motion.button>

              <motion.button

                onClick={submitAnswer}

                disabled={isSubmitting}

                whileTap={{ scale: 0.95 }}

                className="flex-1 bg-gradient-to-r from-[#7E174D] via-[#9D174D] to-[#BE185D] text-white py-3 sm:py-4 rounded-2xl shadow-lg shadow-pink-950/50 hover:from-[#9D174D] hover:via-[#BE185D] hover:to-[#DB2777] transition font-semibold disabled:bg-[#241B35] disabled:text-purple-300/40"

              >

                {isSubmitting ? "Submitting..." : "Submit Answer"}

              </motion.button>

            </div>

          ):(

            <motion.div 

              initial={{opacity:0}}

              animate={{opacity:1}}

              className="mt-6 bg-gradient-to-br from-[#17104A]/90 to-[#4C164C]/90 border border-purple-800/60 p-5 rounded-2xl shadow-lg shadow-purple-950/40"

            >

              <p className="text-purple-100 font-medium mb-4">

                {feedback}

              </p>

              <button 

                onClick={handleNext}

                className="w-full bg-gradient-to-r from-[#7E174D] via-[#9D174D] to-[#BE185D] text-white py-3 rounded-xl shadow-md shadow-pink-950/50 hover:from-[#9D174D] hover:via-[#BE185D] hover:to-[#DB2777] transition flex items-center justify-center gap-1"

              >

                Next Question <BsArrowRight size={18}/>

              </button>

            </motion.div>

          )}

        </div>

      </div>

    </div>

  );

}

export default Interview
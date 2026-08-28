import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { ImOffice } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"



function Report({ report }) {
  if (!report) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05051A] via-[#17104A] to-[#9D174D]'>
        <p className='text-purple-200 text-lg'>
          Loading Report...
        </p>
      </div>
    );
  }

  const navigate = useNavigate()

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((question, index) => ({
  name: `Q${index + 1}`,
  score: question.score || 0,
  question: question.question || "",
  feedback: question.feedback || "",
}))

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagLine = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagLine = "Excellent clarity and structured responses.";
  } else if (finalScore >= 5) {
    performanceText = "Need minor improvement before interview.";
    shortTagLine = "Good foundation and refine articulation.";
  } else {
    performanceText = "Significant improvement required.";
    shortTagLine = "Work on clarity and confidence.";
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let currentY = 25;

    // ============================================================
    // TITLE
    // ============================================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94);

    doc.text(
      "AI Interview Performance Report",
      pageWidth / 2,
      currentY,
      { align: "center" }
    );

    currentY += 7;

    // Divider
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(0.5);
    doc.line(
      margin,
      currentY,
      pageWidth - margin,
      currentY
    );

    currentY += 15;

    // ============================================================
    // FINAL SCORE
    // ============================================================

    doc.setFillColor(240, 253, 244);

    doc.roundedRect(
      margin,
      currentY,
      contentWidth,
      22,
      4,
      4,
      "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(22, 101, 52);

    doc.text(
      `Final Score: ${finalScore} / 10`,
      pageWidth / 2,
      currentY + 14,
      { align: "center" }
    );

    currentY += 32;

    // ============================================================
    // PERFORMANCE SUMMARY
    // ============================================================

    const summaryHeight = 34;

    doc.setFillColor(249, 250, 251);

    doc.roundedRect(
      margin,
      currentY,
      contentWidth,
      summaryHeight,
      4,
      4,
      "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(55, 65, 81);

    doc.text(
      `Confidence: ${confidence}`,
      margin + 10,
      currentY + 10
    );

    doc.text(
      `Communication: ${communication}`,
      margin + 10,
      currentY + 20
    );

    doc.text(
      `Correctness: ${correctness}`,
      margin + 10,
      currentY + 30
    );

    currentY += summaryHeight + 12;

    // ============================================================
    // PROFESSIONAL ADVICE
    // ============================================================

    let advice = "";

    if (finalScore >= 8) {
      advice =
        "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
    } else if (finalScore >= 5) {
      advice =
        "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    } else {
      advice =
        "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud daily.";
    }

    const splitAdvice = doc.splitTextToSize(
      advice,
      contentWidth - 20
    );

    const adviceHeight = Math.max(
      38,
      25 + splitAdvice.length * 5
    );

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.4);

    doc.roundedRect(
      margin,
      currentY,
      contentWidth,
      adviceHeight,
      4,
      4,
      "FD"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);

    doc.text(
      "Professional Advice",
      margin + 10,
      currentY + 10
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);

    doc.text(
      splitAdvice,
      margin + 10,
      currentY + 20
    );

    currentY += adviceHeight + 12;

    // ============================================================
    // QUESTION-WISE SCORE TABLE
    // ============================================================

    autoTable(doc, {
      startY: currentY,

      margin: {
        left: margin,
        right: margin,
      },

      head: [
        ["#", "Question", "Score", "Feedback"]
      ],

      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question,
        `${q.score}/10`,
        q.feedback,
      ]),

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 4,
        valign: "top",
        textColor: [55, 65, 81],
        lineColor: [229, 231, 235],
        lineWidth: 0.3,
      },

      headStyles: {
        fillColor: [34, 197, 94],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
      },

      bodyStyles: {
        valign: "top",
      },

      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },

      columnStyles: {
        0: {
          cellWidth: 10,
          halign: "center",
        },

        1: {
          cellWidth: 55,
        },

        2: {
          cellWidth: 20,
          halign: "center",
        },

        3: {
          cellWidth: "auto",
        },
      },

      didDrawPage: (data) => {
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);

        doc.text(
          `AI Interview Report • Page ${doc.internal.getNumberOfPages()}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      },
    });

    // ============================================================
    // SAVE PDF
    // ============================================================

    doc.save("AI_Interview_Report.pdf");
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#05051A] via-[#17104A] to-[#9D174D] 
    sm:px-6 lg:px-10 py-8'>
      <div className='mb-8 flex flex-col sm:flex-row sm:items-center
      sm:justify-between gap-4'>
        <div className='mb-10 w-full flex items-start gap-4 flex-wrap'>

          <button
            onClick={() => navigate("/history")}
            className='mt-1 p-3 rounded-full bg-[#17104A] shadow-lg hover:shadow-pink-900/40 
            transition border border-purple-700/40'
          >
            <FaArrowLeft className='text-pink-300' />
          </button>

          <div>
            <h1 className='text-3xl font-bold flex-nowrap text-white'>
              Interview Analytics Dashboard
            </h1>

            <p className='text-purple-200/70 mt-2'>
              AI-powered performance insights.
            </p>
          </div>

        </div>

        <button
          onClick={downloadPDF}
          className='mt-6 inline-flex items-center justify-center
              px-6 py-3 rounded-xl
              bg-gradient-to-r from-[#4C164C] via-[#7E174D] to-[#9D174D]
              border border-pink-700/50
              text-pink-100 font-semibold text-sm sm:text-base shadow-lg shadow-pink-950/40
              hover:from-[#5E1855] hover:via-[#8F174D] hover:to-[#BE185D]
              hover:border-pink-500/60
              hover:shadow-xl hover:shadow-pink-900/40 text-nowrap
              hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300'
        >
          Download PDF
        </button>

      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
        <div className='space-y-6'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-[#17104A] rounded-2xl sm:rounded-3xl shadow-lg shadow-fuchsia-950/30 p-6
    sm:p-8 text-center border border-[#9D174D]/50'
          >
            <h3 className='text-white mb-4 sm:mb-6 text-sm font-bold
            sm:text-base'>Overall Performance</h3>
            <div className='relative w-20 h-20 sm:w-25 sm:h-25 mx-auto'>
              <CircularProgressbar
                value={percentage}
                text={`${score}/10`}
                styles={buildStyles({
                  textSize: "18px",
                  pathColor: "#D946EF",
                  textColor: "#F5D0FE",
                  trailColor: "#05051A",
                })}
              />
            </div>
            <div className="mt-5">
              <p className="font-semibold text-white text-sm sm:text-base">
                {performanceText}
              </p>

              <p className="text-pink-300 text-xs sm:text-sm mt-1">
                {shortTagLine}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-[#0B1026] via-[#151B3F] to-[#39207A] rounded-2xl sm:rounded-3xl shadow-xl border border-purple-500/20 p-6 sm:p-8"
          >
            <h3 className="text-base sm:text-lg font-semibold text-white mb-6">
              Skill Evaluation
            </h3>

            <div className="space-y-5">
              {skills.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2 text-sm sm:text-base">
                    <span className="text-slate-300 font-medium">
                      {s.label}
                    </span>

                    <span className="font-semibold text-purple-200">
                      {s.value}
                    </span>
                  </div>
                  <div className='bg-white h-2 sm:h-3 rounded-full'>
                    <div className='bg-emerald-500 h-full rounded-full'
                      style={{ width: `${s.value * 10}%` }}
                    >

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        <div className='lg:col-span-2 space-y-6'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-gradient-to-br from-[#0B1026] via-[#151B3F] to-[#39207A]
          rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8'>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-6">
              Performance Trend
            </h3>
            <div className='h-64 sm:h-72'>

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#e74091"
                    fill="#951d89"
                    fillOpacity={0.35}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>

            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-[#0B1026] via-[#151B3F] to-[#39207A]
  rounded-2xl sm:rounded-3xl shadow-xl shadow-purple-950/30
  border border-purple-500/20 p-5 sm:p-8"
          >
            <h3 className="text-base sm:text-lg font-semibold text-white mb-6">
              Question Breakdown
            </h3>

            <div className="space-y-6">
              {questionScoreData.map((q, i) => (
                <div
                  key={i}
                  className="bg-[#0B1026]/80 p-4 sm:p-6 rounded-xl
                  sm:rounded-2xl border border-purple-500/30
                  hover:border-purple-400/50 transition-all duration-300"
                >
                  <div
                    className="flex flex-col sm:flex-row sm:justify-between
                    sm:items-start gap-3 mb-4"
                  >
                    <div>
                      <p className="text-xs text-purple-300 mb-1 font-bold">
                        Question {i + 1}
                      </p>

                      <p
                        className="font-semibold text-white text-sm sm:text-base
                        leading-relaxed"
                      >
                        {q.question || "Question not available"}
                      </p>
                    </div>

                    <div className='bg-[#0B1026]/80 text-emerald-400 px-3 py-1
                    rounded-full font-bold text-xs sm:text-sm w-fit'>
                      {q.score ?? 0}/10
                    </div>
                  </div>

                  <div className='bg-[#0B1026]/50 border border-blue-200 p-4
                  rounded-lg '>
                    <p className='text-xs text-green-600 font-semibold mb-1'>
                      AI Feedback
                    </p>
                    <p className='text-sm text-purple-300 leading-relaxed'>
                      {q.feedback && q.feedback.trim() !== ""
                        ? q.feedback
                        : "No feedback available for this question."}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

    </div>
  )
}

export default Report
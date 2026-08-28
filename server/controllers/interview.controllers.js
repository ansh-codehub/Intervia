import fs from "fs";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import { askAi } from "../services/openRouter.services.js";

import User from "../models/user.model.js";

import Interview from "../models/interview.model.js";

// ============================================================
// ANALYZE RESUME
// ============================================================

export const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume required",
            });
        }

        const filepath = req.file.path;

        const fileBuffer = await fs.promises.readFile(filepath);

        const uint8Array = new Uint8Array(fileBuffer);

        const pdf = await pdfjsLib.getDocument({
            data: uint8Array,
        }).promise;

        let resumeText = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);

            const content = await page.getTextContent();

            const pageText = content.items
                .map((item) => item.str)
                .join(" ");

            resumeText += pageText + "\n";
        }

        resumeText = resumeText
            .replace(/\s+/g, " ")
            .trim();

        // ========================================================
        // AI RESUME ANALYSIS
        // ========================================================

        const messages = [
            {
                role: "system",
                content: `
Extract structured data from the resume.

Return ONLY valid JSON.

Do not use Markdown code blocks.

Do not add any explanation.

Use exactly this structure:

{
    "role": "string",
    "experience": "string",
    "projects": ["project1", "project2"],
    "skills": ["skill1", "skill2"]
}
`,
            },
            {
                role: "user",
                content: resumeText,
            },
        ];

        const aiResponse = await askAi(messages);

        if (!aiResponse || !aiResponse.trim()) {
            return res.status(500).json({
                message: "AI returned empty response.",
            });
        }

        // ========================================================
        // CLEAN AI RESPONSE
        // ========================================================

        let cleanedResponse = aiResponse.trim();

        cleanedResponse = cleanedResponse
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        // ========================================================
        // PARSE JSON
        // ========================================================

        let parsed;

        try {
            parsed = JSON.parse(cleanedResponse);
        } catch (error) {
            console.error("AI returned invalid JSON:");
            console.error(aiResponse);

            return res.status(500).json({
                message: "AI returned invalid JSON",
                rawResponse: aiResponse,
            });
        }

        // ========================================================
        // NORMALIZE DATA
        // ========================================================

        const safeProjects = Array.isArray(parsed.projects)
            ? parsed.projects
            : [];

        const safeSkills = Array.isArray(parsed.skills)
            ? parsed.skills
            : [];

        const safeRole =
            typeof parsed.role === "string"
                ? parsed.role.trim()
                : "";

        const safeExperience =
            typeof parsed.experience === "string"
                ? parsed.experience.trim()
                : "";

        // ========================================================
        // DELETE UPLOADED RESUME
        // ========================================================

        if (fs.existsSync(filepath)) {
            await fs.promises.unlink(filepath);
        }

        // ========================================================
        // RESPONSE
        // ========================================================

        return res.status(200).json({
            role: safeRole,
            experience: safeExperience,
            projects: safeProjects,
            skills: safeSkills,
            resumeText,
        });

    } catch (error) {
        console.error("Resume analysis error:", error);

        if (req.file && fs.existsSync(req.file.path)) {
            try {
                await fs.promises.unlink(req.file.path);
            } catch (deleteError) {
                console.error(
                    "Failed to delete resume:",
                    deleteError
                );
            }
        }

        return res.status(500).json({
            message: error.message,
        });
    }
};

// ============================================================
// GENERATE INTERVIEW QUESTIONS
// ============================================================

export const generateQuestion = async (req, res) => {
    try {
        let {
            role,
            experience,
            mode,
            resumeText,
            projects,
            skills,
        } = req.body;

        console.log("=================================");
        console.log("GENERATE INTERVIEW");
        console.log("=================================");

        console.log("Role:", role);
        console.log("Experience:", experience);
        console.log("Mode:", mode);
        console.log("Projects:", projects);
        console.log("Skills:", skills);

        // ========================================================
        // CLEAN BASIC VALUES
        // ========================================================

        role =
            typeof role === "string"
                ? role.trim()
                : "";

        experience =
            typeof experience === "string"
                ? experience.trim()
                : "";

        mode =
            typeof mode === "string"
                ? mode.trim()
                : "Technical";

        // ========================================================
        // VALIDATION
        // ========================================================

        if (!role || !experience || !mode) {
            return res.status(400).json({
                message:
                    "Role, Experience and Mode are required.",
            });
        }

        // ========================================================
        // NORMALIZE PROJECTS
        // ========================================================

        let safeProjects = [];

        if (Array.isArray(projects)) {
            safeProjects = projects;
        } else if (typeof projects === "string") {
            try {
                const parsedProjects = JSON.parse(projects);

                if (Array.isArray(parsedProjects)) {
                    safeProjects = parsedProjects;
                }
            } catch (error) {
                safeProjects = [];
            }
        }

        // ========================================================
        // NORMALIZE SKILLS
        // ========================================================

        let safeSkills = [];

        if (Array.isArray(skills)) {
            safeSkills = skills;
        } else if (typeof skills === "string") {
            try {
                const parsedSkills = JSON.parse(skills);

                if (Array.isArray(parsedSkills)) {
                    safeSkills = parsedSkills;
                }
            } catch (error) {
                safeSkills = [];
            }
        }

        // ========================================================
        // RESUME
        // ========================================================

        const safeResume =
            typeof resumeText === "string" &&
                resumeText.trim()
                ? resumeText.trim()
                : "None";

        // ========================================================
        // CONVERT ARRAYS TO TEXT
        // ========================================================

        const projectText =
            safeProjects.length > 0
                ? safeProjects.join(", ")
                : "None";

        const skillsText =
            safeSkills.length > 0
                ? safeSkills.join(", ")
                : "None";

        console.log("Project text:", projectText);
        console.log("Skills text:", skillsText);

        // ========================================================
        // FIND USER
        // ========================================================

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // ========================================================
        // CHECK CREDITS
        // ========================================================

        if (user.credits < 50) {
            return res.status(400).json({
                message: "Not enough credits.",
            });
        }

        // ========================================================
        // USER PROMPT
        // ========================================================

        const userPrompt = `
Role: ${role}

Experience: ${experience}

Interview Mode: ${mode}

Projects:
${projectText}

Skills:
${skillsText}

Resume:
${safeResume}
`;

        if (!userPrompt.trim()) {
            return res.status(400).json({
                message: "Prompt content is empty.",
            });
        }

        // ========================================================
        // AI PROMPT
        // ========================================================

        const messages = [
            {
                role: "system",
                content: `
You are a real interviewer conducting a professional interview.

Speak in simple, neutral English as if you are directly talking to the candidate.

Generate exactly 10 interview questions.

Strict Rules:

- Generate exactly 10 questions.
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- DO NOT number them.
- DO NOT add explanations.
- DO NOT add extra text before or after the questions.
- One question per line only.
- Keep language simple and conversational.
- Questions must be practical and realistic.
- Questions must be relevant to the candidate's role.
- Use the candidate's projects and skills whenever relevant.
- Do not repeat questions.

Difficulty progression:

Questions 1-3: Easy
Questions 4-6: Medium
Questions 7-10: Hard

Make questions based on:

- Candidate role
- Experience
- Interview mode
- Projects
- Skills
- Resume

Return ONLY the 10 questions, one question per line.
`,
            },
            {
                role: "user",
                content: userPrompt,
            },
        ];

        // ========================================================
        // ASK AI
        // ========================================================

        const aiResponse = await askAi(messages);

        if (!aiResponse || !aiResponse.trim()) {
            return res.status(500).json({
                message: "AI returned empty response.",
            });
        }

        console.log("AI response:");
        console.log(aiResponse);

        // ========================================================
        // CLEAN QUESTIONS
        // ========================================================

        let cleanedQuestions = aiResponse
            .replace(/```/g, "")
            .trim();

        const questionsArray = cleanedQuestions
            .split(/\r?\n/)
            .map((q) => q.trim())
            .map((q) =>
                q.replace(/^\d+[\).\-\:]\s*/, "")
            )
            .filter(
                (q) =>
                    typeof q === "string" &&
                    q.length > 0
            )
            .slice(0, 10);

        // ========================================================
        // VALIDATE QUESTIONS
        // ========================================================

        if (questionsArray.length < 10) {
            console.error(
                "AI generated only:",
                questionsArray.length,
                "questions"
            );

            return res.status(500).json({
                message:
                    "AI failed to generate 10 interview questions.",
                questionsGenerated:
                    questionsArray.length,
            });
        }

        // ========================================================
        // CREATE QUESTIONS OBJECT
        // ========================================================

        const difficulties = [
            "easy",
            "easy",
            "easy",
            "medium",
            "medium",
            "medium",
            "hard",
            "hard",
            "hard",
            "hard",
        ];

        const timeLimits = [
            60,
            60,
            60,
            90,
            90,
            90,
            120,
            120,
            120,
            120,
        ];

        const formattedQuestions =
            questionsArray.map(
                (question, index) => ({
                    question: question,
                    difficulty: difficulties[index],
                    timeLimit: timeLimits[index],
                    answer: "",
                    score: 0,
                    confidence: 0,
                    communication: 0,
                    correctness: 0,
                    feedback: "",
                })
            );

        user.credits -= 50;

        await user.save();

        // ========================================================
        // CREATE INTERVIEW
        // ========================================================

        const interview = await Interview.create({
            userId: user._id,
            role,
            experience,
            mode,
            resumeText: safeResume,
            projects: safeProjects,
            skills: safeSkills,
            questions: formattedQuestions,

            // INCOMPLETE when interview is created
            status: "Incomplete",
        });

        console.log(
            "Interview created:",
            interview._id
        );

        return res.status(201).json({
            success: true,
            message:
                "Interview created successfully.",
            interviewId:
                interview._id,
            creditsLeft:
                user.credits,
            userName:
                user.name,
            questions:
                interview.questions,
        });

    } catch (error) {
        console.error(
            "Generate interview error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to create interview",
            error: error.message,
        });
    }
};

// ============================================================
// SUBMIT ANSWER
// ============================================================

export const submitAnswer = async (req, res) => {
    try {
        const {
            interviewId,
            questionIndex,
            answer,
            timeTaken,
        } = req.body;

        const interview =
            await Interview.findById(
                interviewId
            );

        if (!interview) {
            return res.status(404).json({
                message:
                    "Interview not found.",
            });
        }

        const question =
            interview.questions[
            questionIndex
            ];

        if (!question) {
            return res.status(400).json({
                message:
                    "Question not found.",
            });
        }

        // ========================================================
        // EMPTY ANSWER
        // ========================================================

        if (
            !answer ||
            !answer.trim()
        ) {
            question.score = 0;

            question.feedback =
                "You did not submit an answer.";

            question.answer = "";

            await interview.save();

            return res.status(200).json({
                feedback:
                    question.feedback,
                score: 0,
            });
        }

        // ========================================================
        // TIME LIMIT
        // ========================================================

        if (
            Number(timeTaken) >
            Number(question.timeLimit)
        ) {
            question.score = 0;

            question.feedback =
                "Time limit exceeded. Answer not evaluated.";

            question.answer = answer;

            await interview.save();

            return res.status(200).json({
                feedback:
                    question.feedback,
                score: 0,
            });
        }

        // ========================================================
        // AI EVALUATION
        // ========================================================

        const messages = [
            {
                role: "system",
                content: `
You are a professional human interviewer evaluating a candidate's answer.

Evaluate naturally and fairly.

Score the answer in these areas from 0 to 10:

1. Confidence
2. Communication
3. Correctness

Calculate:

finalScore = average of confidence, communication, and correctness.

Round finalScore to the nearest whole number.

Feedback Rules:

- Write natural human feedback.
- 10 to 15 words only.
- Sound like real interview feedback.
- Suggest improvement when needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep the tone professional and honest.

Return ONLY valid JSON.

Use exactly this format:

{
  "confidence": 0,
  "communication": 0,
  "correctness": 0,
  "finalScore": 0,
  "feedback": "short human feedback"
}
`,
            },
            {
                role: "user",
                content: `
Question:

${question.question}

Candidate Answer:

${answer}
`,
            },
        ];

        const aiResponse =
            await askAi(messages);

        if (
            !aiResponse ||
            !aiResponse.trim()
        ) {
            return res.status(500).json({
                message:
                    "AI returned empty evaluation.",
            });
        }

        // ========================================================
        // CLEAN AI RESPONSE
        // ========================================================

        let cleanedResponse =
            aiResponse.trim();

        cleanedResponse =
            cleanedResponse
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();

        // ========================================================
        // PARSE JSON
        // ========================================================

        let parsed;

        try {
            parsed =
                JSON.parse(
                    cleanedResponse
                );
        } catch (error) {
            console.error(
                "Invalid AI evaluation JSON:",
                aiResponse
            );

            return res.status(500).json({
                message:
                    "AI returned invalid evaluation JSON.",
            });
        }

        // ========================================================
        // SCORES
        // ========================================================

        const confidence =
            Number(parsed.confidence) || 0;

        const communication =
            Number(parsed.communication) || 0;

        const correctness =
            Number(parsed.correctness) || 0;

        const finalScore =
            Number(parsed.finalScore) ||
            Math.round(
                (
                    confidence +
                    communication +
                    correctness
                ) / 3
            );

        // ========================================================
        // SAVE ANSWER
        // ========================================================

        question.answer = answer;

        question.confidence =
            confidence;

        question.communication =
            communication;

        question.correctness =
            correctness;

        question.score =
            finalScore;

        question.feedback =
            parsed.feedback ||
            "Answer evaluated successfully.";

        await interview.save();

        return res.status(200).json({
            success: true,
            feedback:
                question.feedback,
            score:
                finalScore,
            confidence,
            communication,
            correctness,
        });

    } catch (error) {
        console.error(
            "Submit answer error:",
            error
        );

        return res.status(500).json({
            message:
                `Failed to submit answer ${error.message}`,
        });
    }
};

// ============================================================
// FINISH INTERVIEW
// ============================================================

export const finishInterview = async (
    req,
    res
) => {
    try {
        const {
            interviewId,
        } = req.body;

        const interview =
            await Interview.findById(
                interviewId
            );

        if (!interview) {
            return res.status(404).json({
                message:
                    "Failed to find interview.",
            });
        }

        const totalQuestions =
            interview.questions.length;

        if (totalQuestions === 0) {
            return res.status(400).json({
                message:
                    "Interview has no questions.",
            });
        }

        let totalScore = 0;
        let totalConfidence = 0;
        let totalCommunication = 0;
        let totalCorrectness = 0;

        interview.questions.forEach(
            (question) => {
                totalScore +=
                    Number(
                        question.score
                    ) || 0;

                totalConfidence +=
                    Number(
                        question.confidence
                    ) || 0;

                totalCommunication +=
                    Number(
                        question.communication
                    ) || 0;

                totalCorrectness +=
                    Number(
                        question.correctness
                    ) || 0;
            }
        );

        const finalScore =
            totalScore /
            totalQuestions;

        const avgConfidence =
            totalConfidence /
            totalQuestions;

        const avgCommunication =
            totalCommunication /
            totalQuestions;

        const avgCorrectness =
            totalCorrectness /
            totalQuestions;

        interview.finalScore =
            finalScore;

        // Interview is now completed
        interview.status =
            "Completed";

        await interview.save();

        return res.status(200).json({
            success: true,

            finalScore:
                Number(
                    finalScore.toFixed(1)
                ),

            confidence:
                Number(
                    avgConfidence.toFixed(1)
                ),

            communication:
                Number(
                    avgCommunication.toFixed(1)
                ),

            correctness:
                Number(
                    avgCorrectness.toFixed(1)
                ),

            questionWiseScore:
                interview.questions.map(
                    (question) => ({
                        question:
                            question.question,

                        score:
                            question.score ||
                            0,

                        feedback:
                            question.feedback ||
                            "",

                        confidence:
                            question.confidence ||
                            0,

                        communication:
                            question.communication ||
                            0,

                        correctness:
                            question.correctness ||
                            0,
                    })
                ),
        });

    } catch (error) {
        console.error(
            "Finish interview error:",
            error
        );

        return res.status(500).json({
            message:
                `Failed to finish interview ${error.message}`,
        });
    }
};

// ============================================================
// GET MY INTERVIEWS
// ============================================================

export const getMyInterviews = async (
    req,
    res
) => {
    try {
        const interviews =
            await Interview.find({
                userId: req.userId,
            })
                .sort({
                    createdAt: -1,
                })
                .select(
                    "_id role experience mode finalScore status createdAt"
                );

        return res.status(200).json(
            interviews
        );

    } catch (error) {
        return res.status(500).json({
            message:
                `Failed to find current user interviews ${error}`,
        });
    }
};

// ============================================================
// GET INTERVIEW REPORT
// ============================================================

export const getInterviewReport = async (
    req,
    res
) => {
    try {
        const interview =
            await Interview.findById(
                req.params.id
            );

        if (!interview) {
            return res.status(404).json({
                message:
                    "Interview not found",
            });
        }

        const totalQuestions =
            interview.questions.length;

        let totalConfidence = 0;
        let totalCommunication = 0;
        let totalCorrectness = 0;

        interview.questions.forEach((q) => {

            // FIXED: confidence spelling
            totalConfidence +=
                q.confidence || 0;

            totalCommunication +=
                q.communication || 0;

            totalCorrectness +=
                q.correctness || 0;
        });

        const avgConfidence =
            totalQuestions
                ? totalConfidence /
                totalQuestions
                : 0;

        const avgCommunication =
            totalQuestions
                ? totalCommunication /
                totalQuestions
                : 0;

        const avgCorrectness =
            totalQuestions
                ? totalCorrectness /
                totalQuestions
                : 0;

        return res.json({
            finalScore:
                interview.finalScore,

            confidence:
                Number(
                    avgConfidence.toFixed(1)
                ),

            communication:
                Number(
                    avgCommunication.toFixed(1)
                ),

            correctness:
                Number(
                    avgCorrectness.toFixed(1)
                ),

            questionWiseScore:
                interview.questions,
        });

    } catch (error) {
        return res.status(500).json({
            message:
                `Failed to find current user interview report ${error}`,
        });
    }
};
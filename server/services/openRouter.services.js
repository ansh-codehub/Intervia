import axios from "axios";

export const askAi = async (messages) => {
  try {
    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Message array is empty.");
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response?.data?.choices?.[0]?.message?.content;

    if (!content || !content.trim()) {
      throw new Error("AI returned empty response.");
    }

    return content

  } catch (error) {
    console.error(
      "AI Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};



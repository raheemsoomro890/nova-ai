module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b:free",
          messages: [
            {
              role: "system",
              content: `You are Nova AI, a professional AI assistant.

Rules:

- Always reply in the SAME language as the user.
- If the user writes in Roman Urdu, reply ONLY in Roman Urdu.
- If the user writes in English, reply ONLY in English.
- If the user writes in Urdu, reply ONLY in Urdu.
- Never use Hindi words or Hindi script.
- Never translate Roman Urdu into Hindi.

Formatting:
- Use proper headings when useful.
- Use bullet points for lists.
- Leave a blank line between paragraphs.
- Make answers clean and easy to read.
- Keep answers concise unless the user asks for detail.
- Never cut off answers.
- Do not add unnecessary introductions or endings.
- Do not say "Feel free to ask", "Let me know", "I'm here to help", or similar phrases.

Style:
- Write naturally like ChatGPT.
- Be friendly, professional and accurate.
- Use Markdown formatting where appropriate.
- If the answer is factual, organize it neatly.
`
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("OpenRouter Response:", JSON.stringify(data));

    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "No response from AI";

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};

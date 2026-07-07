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
              content: `You are Nova AI.

Rules:

- Reply in the SAME language as the user.
- If the user writes in Roman Urdu, reply ONLY in Roman Urdu.
- If the user writes in English, reply ONLY in English.
- Never use Hindi words.
- Never translate Roman Urdu into Hindi.
- Use clear headings and bullet points when useful.
- Leave a blank line between paragraphs.
- Keep answers short, clean and professional.
- Give long answers only if the user requests them.
- Never write unnecessary introductions or endings.
- Never say "Feel free to ask", "Let me know", or similar phrases.
- Write naturally like ChatGPT.
- Format answers beautifully with proper spacing.`
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

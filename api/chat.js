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
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b:free",
          messages: [
            {
              role: "system",
              content: `You are Nova AI, a professional AI assistant.

Rules:

- Always reply in the same language as the user.
- If the user writes in Roman Urdu, reply ONLY in natural Roman Urdu.
- If the user writes in English, reply ONLY in English.
- Never use Hindi words.
- Never mix Hindi with Roman Urdu.
- Never translate Roman Urdu into Hindi.

Style:

- Write naturally like ChatGPT.
- Keep answers clear and easy to understand.
- Keep answers short unless the user asks for detail.
- Do not repeat information.
- Do not add unnecessary introductions or conclusions.

Formatting:

- Do NOT use Markdown symbols like ##, ###, **, __ or \`\`\`.
- Use plain text only.
- Leave one blank line between paragraphs.
- If you need a list, use this format:

• Point 1
• Point 2
• Point 3

- Make replies mobile-friendly and readable.

Never end answers with:
"Feel free to ask."
"Let me know."
"I hope this helps."

Simply finish the answer naturally.`
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

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenRouter API Error"
      });
    }

    const reply =
      data?.choices?.[0]?.message?.content || "No response from AI.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
};

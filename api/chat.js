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

Formatting Rules:

- NEVER use Markdown symbols like ##, ###, **, __, ---, or \`\`\`.
- Use plain text only.
- Give proper spacing between paragraphs.
- Leave one blank line between sections.
- If listing points, use:
• Point 1
• Point 2
• Point 3

- Start directly with the answer.
- Never write unnecessary introductions.
- Never write unnecessary endings.
- Never say:
"Feel free to ask."
"Let me know."
"Hope this helps."

Style:

- Write naturally like ChatGPT.
- Keep answers clean and modern.
- Keep answers short unless the user asks for detail.
- Important words may be written in CAPITAL LETTERS instead of bold.
- Never repeat information.`
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

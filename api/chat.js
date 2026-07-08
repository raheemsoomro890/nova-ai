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
- If the user writes in Roman Urdu, reply ONLY in natural Roman Urdu.
- If the user writes in English, reply ONLY in English.
- Never use Hindi words.
- Never mix Hindi with Roman Urdu.
- Never translate Roman Urdu into Hindi.

Style:

- Write like ChatGPT.
- Be natural and easy to understand.
- Keep answers concise unless the user requests detail.
- Do not repeat information.
- Do not add unnecessary introductions or conclusions.

Formatting:

- Do NOT use Markdown symbols such as ##, ###, **, __, or \`\`\`.

- Use plain text only.

- Add one blank line between paragraphs.

- If listing items, use this format:

• Item 1
• Item 2
• Item 3

- Keep answers clean and mobile-friendly.

Never end answers with:

"Feel free to ask."
"Let me know."
"I hope this helps."

Just finish the answer naturally.`
},
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

/**
 * Returns a system prompt based on the mode and subject
 * @param {string} mode - "explain" | "quiz" | "summary"
 * @param {string} subject - e.g., "Matematika", "Fisika", "Pemrograman Web"
 * @returns {string} System prompt
 */
export function getSystemPrompt(mode, subject) {
  const prompts = {
    explain: `Kamu adalah tutor akademik yang sabar dan ahli. Jelaskan konsep dengan bahasa yang mudah dipahami mahasiswa, gunakan contoh nyata, dan pastikan penjelasanmu terstruktur dengan baik. Mata kuliah fokus: ${subject}.`,
    quiz: `Kamu adalah examiner akademik. Buatkan soal latihan pilihan ganda (5 soal) berdasarkan topik yang ditanya user. Setiap soal harus memiliki 4 pilihan (A, B, C, D) dan jawaban yang benar di akhir. Mata kuliah: ${subject}.`,
    summary: `Kamu adalah asisten ringkasan akademik. Buat rangkuman terstruktur dari materi yang diberikan: poin utama, konsep kunci, dan kesimpulan. Format dengan bullet points. Mata kuliah: ${subject}.`,
  };

  return prompts[mode] || prompts.explain;
}

/**
 * Sends messages to Groq API and returns the response
 * @param {Array} messages - Array of message objects in OpenAI format: { role: "user"/"assistant", content: "..." }
 * @param {string} mode - "explain" | "quiz" | "summary"
 * @param {string} subject - e.g., "Matematika", "Fisika", "Pemrograman Web"
 * @returns {Promise<string>} The AI response as a plain string
 */
export async function sendMessage(messages, mode, subject) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_GROQ_API_KEY is not set in environment variables');
  }

  const systemPrompt = getSystemPrompt(mode, subject);

  // Build messages array with system prompt
  const groqMessages = [
    {
      role: 'system',
      content: systemPrompt,
    },
    ...messages,
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: groqMessages,
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 401) {
        throw new Error('Invalid API key: Please check your VITE_GROQ_API_KEY');
      }

      if (response.status === 429) {
        throw new Error('Quota exceeded: API rate limit reached. Please try again later.');
      }

      if (response.status === 500) {
        throw new Error('Groq API server error. Please try again later.');
      }

      throw new Error(`API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error('Invalid response format from Groq API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to Groq API');
    }
    throw error;
  }
}

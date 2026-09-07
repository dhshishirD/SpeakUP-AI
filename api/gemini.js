// Vercel Serverless Function: World-Class Gemini AI Proxy
// Hidden API Key + Multi-Model Fallback + Persona Conditioning + Ultra-Low Latency

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { contents, systemInstruction, persona } = req.body;
        const apiKey = process.env.GEMINI_API_KEY || "AQ.Ab8RN6JEp5Ew6snucSDMw0FhGxqKinqE1ncmMrsVT0UE0O8vVQ";

        let sysText = systemInstruction?.parts?.[0]?.text || typeof systemInstruction === 'string' ? systemInstruction : "You are SpeakUP AI, a world-class intelligent Spoken English tutor for Bangladeshi learners.";
        
        if (persona && typeof persona === 'object') {
            sysText = `[Active Persona: ${persona.name} (${persona.role})]. ${persona.instructions}\n` + sysText;
        }

        const modelsToTry = [
            "gemini-2.5-flash",
            "gemini-1.5-flash",
            "gemini-2.0-flash",
            "gemini-1.5-pro"
        ];

        let lastError = null;

        for (const model of modelsToTry) {
            try {
                const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

                const payload = {
                    contents: contents || [],
                    systemInstruction: { parts: [{ text: sysText }] },
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 600
                    }
                };

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                        return res.status(200).json(data);
                    }
                } else {
                    lastError = await response.text();
                    console.warn(`Model ${model} failed with status ${response.status}: ${lastError}`);
                }
            } catch (err) {
                lastError = err.message;
                console.warn(`Model ${model} error:`, err);
            }
        }

        return res.status(500).json({ error: "All Gemini AI models failed: " + lastError });
    } catch (error) {
        console.error("Serverless Proxy Error:", error);
        return res.status(500).json({ error: error.message });
    }
}

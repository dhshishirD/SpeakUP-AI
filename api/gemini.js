// Vercel Serverless Function: World-Class Gemini AI Proxy
// Priority: gemini-3.5-flash (Ultra-Fast 2026 Production Endpoint) + Multi-Model Fallback

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { contents, systemInstruction, persona, userApiKey } = req.body;
        const apiKey = userApiKey || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(401).json({ 
                error: 'GEMINI_API_KEY is missing. Please add GEMINI_API_KEY to your Vercel Environment Variables and redeploy, or enter your API key in app Settings.' 
            });
        }

        let sysText = typeof systemInstruction === 'string' ? systemInstruction : (systemInstruction?.parts?.[0]?.text || "You are SpeakUP AI, a world-class intelligent Spoken English tutor for Bangladeshi learners.");
        
        if (persona && typeof persona === 'object') {
            sysText = `[Active Persona: ${persona.name} (${persona.role})]. ${persona.instructions}\n` + sysText;
        }

        // Clean & sanitize contents array for Gemini API
        let formattedContents = [];
        if (Array.isArray(contents)) {
            for (let item of contents) {
                if (item && item.parts && item.parts[0] && item.parts[0].text) {
                    let role = (item.role === 'model' || item.role === 'assistant') ? 'model' : 'user';
                    formattedContents.push({ role: role, parts: [{ text: item.parts[0].text }] });
                }
            }
        }
        
        while (formattedContents.length > 0 && formattedContents[0].role !== 'user') {
            formattedContents.shift();
        }

        if (formattedContents.length === 0) {
            formattedContents = [{ role: 'user', parts: [{ text: 'Hello!' }] }];
        }

        // Official Google Gemini API production model identifiers
        const modelsToTry = [
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-1.5-flash-8b",
            "gemini-1.5-pro"
        ];

        let lastError = null;

        for (const model of modelsToTry) {
            try {
                const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

                const payload = {
                    contents: formattedContents,
                    systemInstruction: { parts: [{ text: sysText }] },
                    generationConfig: {
                        temperature: 0.8,
                        maxOutputTokens: 1024,
                        topP: 0.95
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

        return res.status(500).json({ error: "Gemini API call failed: " + lastError });
    } catch (error) {
        console.error("Serverless Proxy Error:", error);
        return res.status(500).json({ error: error.message });
    }
}

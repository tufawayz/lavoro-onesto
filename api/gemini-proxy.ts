// /api/gemini-proxy.ts
// Vercel Edge Function to securely proxy requests to the Google Gemini API.
import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge', // Use the modern Edge runtime
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured on the server.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const { action, payload } = await request.json();

    // Handle non-streaming (JSON) cases
    let prompt: string;
    let config: any = {};
    
    switch (action) {
      case 'analyze':
        prompt = `Analizza la seguente descrizione di un'esperienza lavorativa negativa. Estrai le problematiche principali come una lista di stringhe per i "tags" (massimo 3) e fornisci un breve "summary" del problema.
        Descrizione: "${payload.description}"
        Restituisci ESATTAMENTE e SOLO un oggetto JSON con questa struttura: { "tags": ["tag1", "tag2"], "summary": "riassunto del problema" }`;
        config = {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tags: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              summary: { type: Type.STRING }
            }
          }
        };
        break;

      case 'advice':
        const report = payload.report;
        prompt = `Un utente ha segnalato l'azienda "${report.companyName}" nel settore "${report.sector}" per le seguenti ragioni: ${report.title}. La sua descrizione del problema è: "${report.description}". 
        Basandoti su questo, fornisci suggerimenti costruttivi e pratici su come i consumatori, altri lavoratori e la community possono agire. 
        Struttura la risposta in Markdown. Includi:
        - Un paragrafo su come diffondere consapevolezza in modo efficace.
        - Suggerimenti per trovare alternative etiche all'azienda (se applicabile).
        - Modi concreti per sostenere i lavoratori attuali o passati.
        Evita un linguaggio aggressivo. Sii propositivo e focalizzati su azioni realizzabili.`;
        break;

      default:
        return new Response(JSON.stringify({ error: `Invalid action: ${action}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: config
    });
    
    return new Response(JSON.stringify({ text: response.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Proxy Error:", error);
    const errorMessage = error.message || 'An internal server error occurred.';
    return new Response(JSON.stringify({ error: errorMessage, details: error.toString() }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

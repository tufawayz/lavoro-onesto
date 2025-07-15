
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

  // API_KEY is securely accessed from Vercel's environment variables
  // IMPORTANT: The variable on Vercel must be named API_KEY.
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

      case 'resources':
        prompt = `Crea una sezione di risorse utili per i lavoratori in Italia, formattata in Markdown. La risposta deve essere chiara, ben strutturata e facile da leggere. Includi:
        - Un'introduzione sui diritti fondamentali del lavoratore (orario, ferie, contratto).
        - Una sezione "A chi rivolgersi" con una lista di enti utili come Ispettorato del Lavoro, sindacati e patronati (usa nomi generici, non link specifici).
        - Una sezione "Come Documentare gli Abusi" con consigli pratici (es. salvare email, screenshot, tenere un diario).
        - Un paragrafo finale sull'importanza della privacy e della condivisione anonima per proteggere se stessi e aiutare gli altri.`;
        break;

      default:
        throw new Error(`Invalid action: ${action}`);
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

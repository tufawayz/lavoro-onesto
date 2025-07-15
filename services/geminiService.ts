
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, ExperienceReport } from "../types";

const model = "gemini-2.5-flash";

// Helper function to initialize the Gemini API client safely.
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API key not found. Please ensure the API_KEY environment variable is set.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeReportContent = async (description: string): Promise<AnalysisResult> => {
  const ai = getAiClient();
  if (!ai) {
     return {
      tags: ["Errore di Configurazione"],
      summary: "La chiave API per il servizio di analisi non è stata configurata correttamente. Contatta l'amministratore del sito.",
    };
  }
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Analizza la seguente descrizione di un'esperienza lavorativa negativa. Estrai le problematiche principali come tag (massimo 3) e fornisci un breve riassunto del problema. Restituisci il risultato in formato JSON. Descrizione: "${description}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Elenco delle problematiche chiave (es. 'Salario Basso', 'Orario Eccessivo')."
            },
            summary: {
              type: Type.STRING,
              description: "Un breve riassunto di 1-2 frasi della segnalazione."
            }
          },
          required: ["tags", "summary"]
        }
      }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing report content with Gemini:", error);
    // Fallback in case of API error
    return {
      tags: ["Analisi Fallita"],
      summary: "Non è stato possibile analizzare il contenuto della segnalazione.",
    };
  }
};

export const generateBoycottAdvice = async (report: ExperienceReport): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Servizio non disponibile: configurazione API mancante.";
  try {
    const prompt = `Un utente ha segnalato l'azienda "${report.companyName}" nel settore "${report.sector}" per le seguenti ragioni: ${report.title}. Fornisci suggerimenti costruttivi su come i consumatori e altri lavoratori possono agire. Includi alternative all'azienda (se possibile), modi per sostenere i lavoratori e come diffondere consapevolezza. Evita un linguaggio aggressivo. Sii pratico e propositivo.`;
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating advice with Gemini:", error);
    return "Non è stato possibile generare suggerimenti in questo momento. Riprova più tardi.";
  }
};


export const generateResourceContent = async (): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "### Errore\n\nServizio non disponibile: configurazione API mancante.";
    try {
        const prompt = `Crea una sezione di risorse per lavoratori in Italia in formato Markdown. La sezione deve includere: 1. Un'introduzione sui diritti fondamentali del lavoratore. 2. Una lista di link a sindacati e patronati italiani (usa link placeholder come 'https://link.a.sindacato.it'). 3. Consigli su come documentare abusi sul posto di lavoro. 4. Un paragrafo sulla tutela della privacy e l'importanza delle segnalazioni anonime.`;
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating resource content with Gemini:", error);
        return "### Errore nel caricamento delle risorse\n\nNon è stato possibile caricare le informazioni in questo momento. Riprova più tardi.";
    }
};


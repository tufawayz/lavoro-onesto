
import type { AnalysisResult, ExperienceReport } from "../types";

const PROXY_URL = '/api/gemini-proxy';

/**
 * Helper function to call our secure proxy.
 * @param action The action for the proxy to perform.
 * @param payload The data to send to the proxy.
 * @returns The text response from the AI.
 */
const callProxy = async (action: string, payload: any): Promise<string> => {
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, payload }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error or invalid JSON response' }));
    console.error(`Error calling proxy for action '${action}':`, errorData);
    throw new Error(errorData.error || `Proxy request failed with status ${response.status}`);
  }
  
  const data = await response.json();
  // The proxy now returns a consistent { text: "..." } object
  return data.text;
};

export const analyzeReportContent = async (description: string): Promise<AnalysisResult> => {
  try {
    const jsonText = await callProxy('analyze', { description });
     // Since the AI is now configured to return JSON, we parse it.
    const parsedResult = JSON.parse(jsonText);
    
    // Basic validation to ensure the result has the expected shape
    if (parsedResult && Array.isArray(parsedResult.tags) && typeof parsedResult.summary === 'string') {
        return parsedResult as AnalysisResult;
    } else {
        // Fallback if the JSON structure is not what we expect
        console.warn("AI response was not in the expected AnalysisResult format.", parsedResult);
        return {
            tags: ["Analisi Incompleta"],
            summary: parsedResult.summary || "L'analisi ha prodotto un risultato in formato inatteso.",
        };
    }
  } catch (error) {
    console.error("Error analyzing report content via proxy:", error);
    // Fallback in case of API error or JSON parsing error
    return {
      tags: ["Analisi Fallita"],
      summary: "Non è stato possibile analizzare il contenuto. Il proxy di sicurezza o il servizio AI potrebbero essere non disponibili.",
    };
  }
};

export const generateBoycottAdvice = async (report: ExperienceReport): Promise<string> => {
  try {
    return await callProxy('advice', { report });
  } catch (error) {
    console.error("Error generating advice via proxy:", error);
    return "Non è stato possibile generare suggerimenti in questo momento. Riprova più tardi.";
  }
};

export const generateResourceContent = async (): Promise<string> => {
    try {
        return await callProxy('resources', {});
    } catch (error) {
        console.error("Error generating resource content via proxy:", error);
        return "### Errore nel caricamento delle risorse\n\nNon è stato possibile caricare le informazioni in questo momento. Riprova più tardi.";
    }
};

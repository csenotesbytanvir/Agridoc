import { GoogleGenAI } from "@google/genai";

const getAI = (apiKey: string) => {
  // Prefer project-level API key if available
  const key = process.env.GEMINI_API_KEY || apiKey;
  return new GoogleGenAI({ apiKey: key });
};

export async function getGeminiResponse(apiKey: string, prompt: string, language: string, base64Image?: string) {
  try {
    const ai = getAI(apiKey);
    
    const contents: any[] = [];
    if (base64Image) {
      contents.push({
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: prompt }
        ]
      });
    } else {
      contents.push({ parts: [{ text: prompt }] });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: `You are AgriDoc, an expert agricultural scientist and agronomist. 
        IMPORTANT: You must detect if the user's input is in Bengali or English.
        If the input is in Bengali, respond in Bengali.
        If the input is in English, respond in English.
        Unless specifically requested to do otherwise, prioritize ${language === 'bn' ? 'Bengali' : 'English'}.
        Use Markdown for formatting: use **bold** for emphasis, lists for steps, and clear paragraph breaks.
        Keep your tone helpful, respectful, and professional.`,
      }
    });
    
    return response.text || "No response received.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function analyzePlantDisease(apiKey: string, base64Image: string, language: string) {
  try {
    const ai = getAI(apiKey);
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: `Identify the plant and any diseases. Return JSON with these exact keys:
          1. plantName: The common name of the plant.
          2. diseaseName: The name of the disease identified.
          3. treatment: Step-by-step mitigation protocol.
          4. medicines: Specific recommended medicines or nutrients.
          5. soilType: Ideal substrate specs.
          6. irrigationNeeds: Hydration protocol.
          7. careInstructions: Strategic care and lifestyle advice.
          8. additionalInfo: More related information for the farmer.
          
          Language: ${language === 'bn' ? 'Bengali' : 'English'}.` }
        ]
      }],
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
}

export async function validateApiKey(apiKey: string) {
  try {
    // If we have a system key, verification always passes
    if (process.env.GEMINI_API_KEY) return true;
    
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Reply 'OK'"
    });
    return response.text?.includes('OK') || false;
  } catch (error) {
    return false;
  }
}

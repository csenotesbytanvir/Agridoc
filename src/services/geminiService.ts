import { GoogleGenAI, Type } from "@google/genai";

export async function getGeminiResponse(apiKey: string, prompt: string, language: string) {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `You are AgriDoc, an expert agricultural scientist and agronomist. Your goal is to help farmers with practical, sustainable, and effective advice. 
        Current language setting: ${language}. Always reply in ${language}. 
        Keep your tone helpful, respectful, and clear.`,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function analyzePlantDisease(apiKey: string, base64Image: string, language: string) {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: `Identify the plant, the disease (if any), suggest medicine, and provide detailed environmental needs. Return JSON with keys: plantName, diseaseName, treatment, medicines, soilType, irrigationNeeds, careInstructions, additionalInfo. Reply in ${language}.` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plantName: { type: Type.STRING },
            diseaseName: { type: Type.STRING },
            treatment: { type: Type.STRING },
            medicines: { type: Type.STRING },
            soilType: { type: Type.STRING },
            irrigationNeeds: { type: Type.STRING },
            careInstructions: { type: Type.STRING },
            additionalInfo: { type: Type.STRING }
          },
          required: ["plantName", "diseaseName", "treatment", "medicines", "soilType", "irrigationNeeds", "careInstructions", "additionalInfo"]
        }
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
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Reply 'OK'",
    });
    return response.text?.includes('OK');
  } catch (error) {
    return false;
  }
}

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
    
    // In v2 SDK, text property is a getter that might throw if call was blocked
    let responseText = "No response received.";
    try {
      responseText = response.text || "No text in response.";
    } catch (e) {
      console.warn("Could not get response text:", e);
      if (response.candidates && response.candidates.length > 0) {
        responseText = response.candidates[0].content?.parts?.find(p => p.text)?.text || "Content blocked or empty.";
      }
    }
    
    return responseText;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function analyzePlantDisease(apiKey: string, base64Image: string, language: string) {
  try {
    const ai = getAI(apiKey);
    
    const promptText = `Identify the plant and any diseases from this image. 
    You MUST return JSON with these exact keys:
    "plantName": name of the plant,
    "diseaseName": name of the disease or "Healthy",
    "treatment": step-by-step treatment,
    "medicines": recommended organic/chemical inputs,
    "soilType": ideal soil conditions,
    "irrigationNeeds": water requirements,
    "careInstructions": additional care tips,
    "additionalInfo": any other relevant facts.
    
    IMPORTANT: Respond strictly in ${language === 'bn' ? 'Bengali (বাংলা)' : 'English'}.
    Do NOT include markdown markers like \`\`\`json. Return only the raw JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        role: "user",
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: promptText }
        ]
      }],
      config: {
        responseMimeType: "application/json",
      }
    });

    let rawText = "";
    try {
      rawText = (response.text || "").trim();
    } catch (e) {
      console.warn("Could not get JSON response text:", e);
      if (response.candidates && response.candidates.length > 0) {
        rawText = response.candidates[0].content?.parts?.find(p => p.text)?.text || "";
      }
    }
    
    // Fallback cleaning if JSON is wrapped in code blocks
    if (rawText.includes('```')) {
      rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    if (!rawText) {
      throw new Error("Empty response from matrix.");
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      console.warn("JSON Parse failed, attempting fallback extraction", rawText);
      // Try to find the first '{' and last '}'
      const firstBrace = rawText.indexOf('{');
      const lastBrace = rawText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        data = JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
      } else {
        throw parseError;
      }
    }
    
    const fallback = {
      plantName: language === 'bn' ? 'অজানা উদ্ভিদ' : 'Unknown Plant',
      diseaseName: language === 'bn' ? 'নির্ণয় করা যায়নি' : 'Healthy / Undertermined',
      treatment: language === 'bn' ? 'কোন তথ্য নেই' : 'No data available',
      medicines: language === 'bn' ? 'কোন তথ্য নেই' : 'No data available',
      soilType: language === 'bn' ? 'কোন তথ্য নেই' : 'No data available',
      irrigationNeeds: language === 'bn' ? 'কোন তথ্য নেই' : 'No data available',
      careInstructions: language === 'bn' ? 'কোন তথ্য নেই' : 'No data available',
      additionalInfo: language === 'bn' ? 'কোন তথ্য নেই' : 'No data available'
    };

    return { ...fallback, ...data };
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
    
    let text = "";
    try {
      text = response.text || "";
    } catch (e) {
      if (response.candidates && response.candidates.length > 0) {
        text = response.candidates[0].content?.parts?.find(p => p.text)?.text || "";
      }
    }
    
    return text.includes('OK');
  } catch (error) {
    return false;
  }
}

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getGeminiResponse(apiKey: string, prompt: string, language: string, base64Image?: string) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `You are AgriDoc, an expert agricultural scientist and agronomist. 
      IMPORTANT: You must detect if the user's input is in Bengali or English.
      If the input is in Bengali, respond in Bengali.
      If the input is in English, respond in English.
      Unless specifically requested to do otherwise, prioritize ${language === 'bn' ? 'Bengali' : 'English'}.
      Use Markdown for formatting: use **bold** for emphasis, lists for steps, and clear paragraph breaks.
      Keep your tone helpful, respectful, and professional.`,
    });

    const parts: any[] = [{ text: prompt }];
    if (base64Image) {
      parts.unshift({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image
        }
      });
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
    });
    
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function analyzePlantDisease(apiKey: string, base64Image: string, language: string) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const response = await model.generateContent({
      contents: [{
        role: "user",
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
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.response.text() || '{}');
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
}

export async function validateApiKey(apiKey: string) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent("Reply 'OK'");
    return response.response.text().includes('OK');
  } catch (error) {
    return false;
  }
}

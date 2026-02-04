
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseTechnicalDrawing = async (imageBase64: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
          },
        },
        {
          text: 'Analyze this industrial technical drawing and extract: Part Code, Model Name, Nominal Dimension, USL (Upper Spec Limit), and LSL (Lower Spec Limit). Return only valid JSON.'
        }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          partCode: { type: Type.STRING },
          modelName: { type: Type.STRING },
          nominal: { type: Type.NUMBER },
          usl: { type: Type.NUMBER },
          lsl: { type: Type.NUMBER }
        },
        required: ['partCode', 'modelName', 'nominal', 'usl', 'lsl']
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return null;
  }
};

export const generateRCA = async (measurements: any[], status: string) => {
  const prompt = `Analyze these industrial measurements: ${JSON.stringify(measurements)}. Status is ${status}. Suggest 3 possible root causes and corrective actions standard for Panasonic Quality Process.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
        thinkingConfig: { thinkingBudget: 0 }
    }
  });

  return response.text;
};

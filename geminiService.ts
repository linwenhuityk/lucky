
import { GoogleGenAI, Type } from "@google/genai";

// getCreativeGroupNames uses the Gemini API to generate professional and fun team names.
export const getCreativeGroupNames = async (count: number): Promise<string[]> => {
  // Always use process.env.API_KEY directly as per the coding guidelines.
  const apiKey = process.env.API_KEY;
  if (!apiKey) return Array.from({ length: count }, (_, i) => `Group ${i + 1}`);

  try {
    // Initialize a new GoogleGenAI instance right before making the API call.
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate ${count} creative, professional, and fun team names for a corporate environment. Return only the names in a JSON array format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    // Access the .text property directly (do not call as a method).
    const text = response.text?.trim();
    if (text) {
      // Explicitly cast the parsed result to string[] to resolve unknown/any type errors.
      const names = JSON.parse(text) as string[];
      if (Array.isArray(names)) {
        return names;
      }
    }
    return Array.from({ length: count }, (_, i) => `Group ${i + 1}`);
  } catch (error) {
    console.error("Failed to fetch creative names", error);
    // Fallback to default names if the API call fails.
    return Array.from({ length: count }, (_, i) => `Group ${i + 1}`);
  }
};

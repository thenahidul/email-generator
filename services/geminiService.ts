
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEduTips = async (category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide 3 concise, professional tips about using educational email addresses for ${category}. Focus on student benefits like GitHub Student Pack, Notion Pro, or academic research software. Format as a JSON array of objects with 'title' and 'description'.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      { title: "Developer Tools", description: "Unlock free developer tools and cloud credits with an academic identity." },
      { title: "Software Discounts", description: "Get significant discounts on creative suites and productivity software." },
      { title: "Research Access", description: "Access scholarly journals and library resources typically restricted to students." }
    ];
  }
};

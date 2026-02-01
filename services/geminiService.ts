
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, IntentType } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const classifyIntent = async (prompt: string): Promise<IntentType> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Classify the following social search prompt into exactly one category: BUILD (projects/work), DATE (romance), EXPLORE (friendship/hobbies), TRADE (buying/selling), STAY (roommates/travel).
      Prompt: "${prompt}"
      Return only the category name.`,
    });
    const result = response.text?.trim().toUpperCase() as IntentType;
    return ['BUILD', 'DATE', 'EXPLORE', 'TRADE', 'STAY'].includes(result) ? result : 'UNKNOWN';
  } catch {
    return 'UNKNOWN';
  }
};

export const searchPeople = async (prompt: string, intent: IntentType): Promise<UserProfile[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the core matching engine for VYBE, a premium social platform. 
      The user search prompt is: "${prompt}". 
      Detected intent: ${intent}.
      Generate 5 highly specific user profiles that would be a perfect match for this request.
      Make them feel like real, complex humans with unique backgrounds.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              age: { type: Type.NUMBER },
              location: { type: Type.STRING },
              role: { type: Type.STRING },
              matchScore: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              vibe: { type: Type.STRING },
              imageUrl: { type: Type.STRING },
              whyMatched: { type: Type.STRING },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              interests: { type: Type.ARRAY, items: { type: Type.STRING } },
              availability: { type: Type.ARRAY, items: { type: Type.STRING } },
              trustScore: { type: Type.NUMBER },
              verified: { type: Type.BOOLEAN },
              linkedAccounts: {
                type: Type.OBJECT,
                properties: {
                  github: { type: Type.STRING },
                  linkedin: { type: Type.STRING },
                  instagram: { type: Type.STRING }
                }
              }
            },
            required: ["id", "name", "age", "location", "role", "matchScore", "summary", "tags", "imageUrl", "whyMatched", "trustScore", "verified"]
          }
        }
      }
    });

    const results = JSON.parse(response.text || "[]");
    return results.map((r: any) => ({
      ...r,
      imageUrl: r.imageUrl || `https://picsum.photos/600/800?random=${r.id}`
    }));
  } catch (error) {
    console.error("Match Engine Error:", error);
    return [];
  }
};

// Fix: Implement the getIcebreakers function that was missing and causing an error in ChatView.tsx
export const getIcebreakers = async (currentUser: UserProfile, targetUser: UserProfile): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 3 short, personalized icebreaker messages for a user named ${currentUser.name} to send to ${targetUser.name}. 
      Context: ${currentUser.name} is a ${currentUser.role} interested in ${currentUser.interests?.join(', ') || 'technology'}. 
      ${targetUser.name} is a ${targetUser.role} interested in ${targetUser.interests?.join(', ') || 'creative projects'}.
      They matched because: ${targetUser.whyMatched}.
      The messages should be short, punchy, and sound like a text message.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Icebreaker Error:", error);
    return [];
  }
};

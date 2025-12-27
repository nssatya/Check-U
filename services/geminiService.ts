import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, AnalysisPayload } from "../types";

export const analyzeData = async (
  payload: AnalysisPayload
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
  });
  const model = "gemini-3-flash-preview";

  const parts: any[] = [];

  // Add the PDF part if provided
  if (payload.resumeBase64) {
    parts.push({
      inlineData: {
        mimeType: payload.resumeMimeType || "application/pdf",
        data: payload.resumeBase64,
      },
    });
  }

  // Define the prompt based on what we're doing
  let promptText = "";
  if (payload.type === "job_match") {
    promptText = `Analyze the attached Resume PDF against this Job Description:
    
    JOB DESCRIPTION:
    ${payload.jobDescription}
    
    Tasks:
    1. Provide a "match score" (0-100) comparing the resume to the JD.
    2. Provide a "summary" which is a professional executive summary of the match/alignment.
    3. Provide a "candidateProfile" which is a 2-3 sentence summary of the candidate's professional background and key strengths based ONLY on their resume.
    4. Extract key statistics (e.g., years of experience, number of matching skills).
    5. Provide 3-5 actionable trends or data points for visualization.
    6. List specific suggestions to improve the resume for this specific job.`;
  } else {
    promptText = `Analyze the attached Resume PDF. 
    1. Provide a "candidateProfile" which is a professional summary of the candidate's skills and background.
    2. Provide a "summary" describing the overall quality of the resume.
    3. Extract key statistics (skills found, education level, etc.).
    4. Provide general career suggestions.`;
  }

  parts.push({ text: promptText });

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          candidateProfile: { type: Type.STRING },
          score: { type: Type.NUMBER },
          stats: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.STRING },
              },
              required: ["label", "value"],
            },
          },
          trends: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                value: { type: Type.NUMBER },
              },
              required: ["name", "value"],
            },
          },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["summary", "candidateProfile", "suggestions"],
      },
    },
  });

  const rawJson = response.text;
  const parsed = JSON.parse(rawJson || "{}");

  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
    type: payload.type,
    summary: parsed.summary || "No match summary generated.",
    candidateProfile:
      parsed.candidateProfile || "No candidate profile generated.",
    score: parsed.score,
    stats: parsed.stats,
    trends: parsed.trends,
    suggestions: parsed.suggestions || [],
    rawInput:
      "PDF Resume" +
      (payload.jobDescription
        ? " | " + payload.jobDescription.substring(0, 50) + "..."
        : ""),
  };
};

import { GoogleGenAI } from '@google/genai';

// Initialize Gemini SDK with apiKey from env
const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function askAiTutor(prompt: string, context?: { questionText?: string; passage?: string; correctAnswer?: string }): Promise<string> {
  if (!ai) {
    return 'Tính năng giải thích với AI chưa được thiết lập khóa API. Bạn vẫn có thể xem phần giải thích chi tiết có sẵn trong bài!';
  }

  try {
    let fullPrompt = `Bạn là Gia Sư Tiếng Anh Lớp 7 tận tâm, thân thiện và nhiệt tình (chuẩn chương trình THCS Việt Nam).
Hãy giải thích ngắn gọn, dễ hiểu, dùng tiếng Việt trong sáng, có ví dụ minh họa và mẹo ghi nhớ cho học sinh lớp 7.

`;
    if (context?.passage) {
      fullPrompt += `[Đoạn văn đọc hiểu]:\n${context.passage}\n\n`;
    }
    if (context?.questionText) {
      fullPrompt += `[Câu hỏi]: ${context.questionText}\n[Đáp án đúng]: ${context.correctAnswer}\n\n`;
    }
    fullPrompt += `[Yêu cầu học sinh]: ${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: fullPrompt,
    });

    return response.text || 'Không nhận được phản hồi từ trợ lý AI.';
  } catch (error) {
    console.error('Error calling Gemini:', error);
    return 'Rất tiếc, đã có lỗi khi kết nối với Gia sư AI. Bạn có thể xem phần giải thích chi tiết bên dưới nhé!';
  }
}

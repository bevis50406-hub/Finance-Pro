
import { GoogleGenAI } from "@google/genai";
import { Transaction, BankAccount, Category } from './types';

// Obtain the API key exclusively from process.env.API_KEY
export const getAIFinanceAdvice = async (
  transactions: Transaction[],
  accounts: BankAccount[],
  categories: Category[]
): Promise<string> => {
  if (!process.env.API_KEY) return "目前處於展示模式，且未設定 API Key。請設定 API_KEY 以獲得 AI 財務建議。";

  try {
    // Fix: Strictly initialize GoogleGenAI as per SDK guidelines using process.env.API_KEY directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Using gemini-3-pro-preview for complex financial analysis reasoning
    const modelName = 'gemini-3-pro-preview';

    const prompt = `
      作為一位專業的財務顧問，請根據以下財務數據提供分析與建議（繁體中文）：
      
      帳戶狀態：
      ${accounts.map(a => `- ${a.name}: 餘額 ${a.balance}`).join('\n')}
      
      近期收支紀錄：
      ${transactions.slice(0, 20).map(t => {
        const cat = categories.find(c => c.id === t.categoryId)?.name || '未分類';
        return `- ${t.date.split('T')[0]} | ${t.type === 'income' ? '收入' : '支出'} | ${cat}: ${t.amount} (${t.note})`;
      }).join('\n')}
      
      請給予具體、有行動力的建議，語氣專業且溫暖。
    `;

    // Fix: Call generateContent with model and contents as specified in the guidelines
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    // Fix: Access the .text property directly (not a method) from GenerateContentResponse
    return response.text || "無法生成建議，請稍後再試。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 服務暫時無法使用。";
  }
};

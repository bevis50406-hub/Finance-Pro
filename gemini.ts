import { GoogleGenAI, Chat } from "@google/genai";
import { Transaction, BankAccount, Category } from './types';

// 封裝一個安全獲取 AI 實例的方法
const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export const getAIFinanceAdvice = async (
  transactions: Transaction[],
  accounts: BankAccount[],
  categories: Category[]
): Promise<string> => {
  try {
    const ai = getAIInstance();
    const modelName = 'gemini-3-flash-preview';

    const prompt = `
      作為一位專業財務顧問，請根據以下真實數據提供一段簡短理財建議（繁體中文）：
      總資產：${accounts.reduce((sum, a) => sum + a.balance, 0)}
      近期交易紀錄：${transactions.slice(0, 10).map(t => `${t.note}: ${t.amount}`).join(', ')}
      建議字數約 80 字，要專業且親切。
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text || "AI 暫時無法產出內容。";
  } catch (error: any) {
    if (error.message === "API_KEY_MISSING") {
      return "目前處於展示模式，請設定 API Key 以啟用 AI 建議。";
    }
    console.error("Gemini Advice Error:", error);
    return "AI 服務通訊異常，請稍後再試。";
  }
};

export const createFinanceChat = (
  transactions: Transaction[],
  accounts: BankAccount[],
  categories: Category[]
): Chat => {
  try {
    const ai = getAIInstance();
    return ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `
          你是一位溫暖且專業的 AI 財務助理 "Gemini Finance Assistant"。
          目前的財務概況：
          - 總資產：${accounts.reduce((sum, a) => sum + a.balance, 0)}
          - 交易筆數：${transactions.length}
          
          請根據這些數據回答使用者的理財疑問。
          回答準則：1. 使用繁體中文。 2. 語氣溫和。 3. 數據驅動。
        `,
      },
    });
  } catch (error) {
    console.error("Failed to create Chat session:", error);
    throw error;
  }
};
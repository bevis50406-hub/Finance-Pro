import { GoogleGenAI, Chat } from "@google/genai";
import { Transaction, BankAccount, Category } from './types';

// 封裝一個安全獲取 AI 實例的方法
const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  // 檢查是否為空字串或佔位符
  if (!apiKey || apiKey.trim() === "" || apiKey === "YOUR_API_KEY") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * 獲取理財建議，使用更快速的 flash 模型。
 */
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
      建議字數約 80 字，要專業、具體且語氣親切。
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text || "AI 目前無法產出建議，請稍後再試。";
  } catch (error: any) {
    if (error.message === "API_KEY_MISSING") {
      return "目前的系統處於展示模式。若要啟用 AI 智慧分析建議，請在環境變數中設定有效的 API Key。";
    }
    console.error("Gemini Advice Error:", error);
    return "AI 智慧服務暫時連線異常，請檢查網路或 API 設定。";
  }
};

/**
 * 建立對話 Session
 */
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
          你是一位專業且親切的 AI 財務助理 "FinancePro Helper"。
          使用者目前的財務概況如下：
          - 帳戶數量：${accounts.length}
          - 總資產：${accounts.reduce((sum, a) => sum + a.balance, 0)}
          - 交易總數：${transactions.length}
          
          請根據這些資訊回答使用者的提問，提供儲蓄、支出管理或投資方面的建議。
          回答規範：
          1. 使用繁體中文。
          2. 語氣像朋友一樣溫暖但保持專業。
          3. 如果涉及到具體數字，請務必精確。
        `,
      },
    });
  } catch (error: any) {
    console.error("Failed to create Chat session:", error);
    throw error;
  }
};
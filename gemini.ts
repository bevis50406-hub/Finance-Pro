
import { GoogleGenAI, Chat } from "@google/genai";
import { Transaction, BankAccount, Category } from './types';

export const getAIFinanceAdvice = async (
  transactions: Transaction[],
  accounts: BankAccount[],
  categories: Category[]
): Promise<string> => {
  if (!process.env.API_KEY) return "目前處於展示模式，且未設定 API Key。";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelName = 'gemini-3-flash-preview';

    const prompt = `
      作為一位專業財務顧問，請分析以下數據：
      帳戶：${accounts.map(a => `${a.name}(${a.balance})`).join(', ')}
      近期交易：${transactions.slice(0, 10).map(t => `${t.note}: ${t.amount}`).join(', ')}
      請給予簡短、具體的理財建議（繁體中文，約 100 字）。
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text || "無法生成建議。";
  } catch (error) {
    return "AI 服務暫時無法使用。";
  }
};

export const createFinanceChat = (
  transactions: Transaction[],
  accounts: BankAccount[],
  categories: Category[]
): Chat => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `
        你是一位溫暖且專業的 AI 財務助理 "Gemini Finance Assistant"。
        你的任務是根據使用者的財務數據回答問題。
        目前數據：
        - 總資產：${accounts.reduce((sum, a) => sum + a.balance, 0)}
        - 帳戶數：${accounts.length}
        - 交易筆數：${transactions.length}
        
        回答規則：
        1. 語氣要親切、有鼓勵性。
        2. 數據分析要精準。
        3. 如果使用者問到如何存錢，請給予具體建議。
        4. 必須使用繁體中文。
      `,
    },
  });
};

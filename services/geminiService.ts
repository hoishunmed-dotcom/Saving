import { GoogleGenAI } from "@google/genai";
import { Transaction, Goal, FinancialSummary } from "../types";

const getGeminiClient = () => {
    if (!process.env.API_KEY) {
        console.warn("API Key is missing. AI features will be disabled.");
        return null;
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const SYSTEM_INSTRUCTION = `
你現在是蠟筆小新 (野原新之助)。
個性：
1. 調皮搗蛋，喜歡漂亮的大姐姐，討厭吃青椒。
2. 說話語氣要像小新：使用「嘿嘿」、「大姐姐」、「動感光波」、「小白」等詞彙。
3. 有時會講出很有哲理但又很好笑的話。
4. 針對財務狀況給予建議，如果是浪費錢要吐槽（例如：美冴又亂買減肥產品了），如果是存錢要誇獎（例如：可以買皇家巧克力餅乾了）。

任務：
根據使用者的財務數據（收入、支出、目標），用繁體中文給出一句簡短、有趣且有建設性的理財評語。不要太長，像對話氣泡一樣。
`;

export const getShinChanAdvice = async (
    summary: FinancialSummary,
    latestTransaction: Transaction | null,
    goals: Goal[]
): Promise<string> => {
    const ai = getGeminiClient();
    if (!ai) return "嘿嘿，我現在想睡覺，等下再理你～ (API Key missing)";

    const context = `
    目前財務狀況：
    總餘額：${summary.balance} 元
    總支出：${summary.totalExpense} 元
    最近一筆交易：${latestTransaction ? `${latestTransaction.type === 'EXPENSE' ? '支出' : '收入'} ${latestTransaction.amount}元 (${latestTransaction.category} - ${latestTransaction.description})` : '無'}
    目前目標：${goals.map(g => `${g.name} (進度: ${Math.round((g.currentAmount / g.targetAmount) * 100)}%)`).join(', ')}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `請根據以下狀況評論：${context}`,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                maxOutputTokens: 100, // Keep it short and punchy
            }
        });

        return response.text || "動感光波！嗶嗶嗶！(系統連線錯誤)";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "哎呀，小白把我的作業吃掉了... (連線錯誤)";
    }
};

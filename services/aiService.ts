import { GEMINI_API_KEY } from "@/constants";
import { ResponseType, ScanResult } from "@/types";
import axios from "axios";
import { readAsStringAsync } from "expo-file-system/legacy";

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SCAN_PROMPT = `Extract from this receipt: totalAmount (number), date (DD/MM/YYYY), description (items bought, Vietnamese, max 5), category (one of: Ăn uống|Di chuyển|Mua sắm|Y tế|Giải trí|Giáo dục|Hóa đơn|Khác). Reply ONLY valid JSON, no markdown.`;

export const scanInvoiceWithAI = async (
    imageUri: string
): Promise<ResponseType> => {
    try {
        // Đọc file ảnh và convert sang base64
        const base64Image = await readAsStringAsync(imageUri, {
            encoding: "base64",
        });
        // Xác định loại ảnh
        const mimeType = imageUri.toLowerCase().endsWith(".png")
            ? "image/png"
            : "image/jpeg";

        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: base64Image,
                            },
                        },
                        {
                            text: SCAN_PROMPT,
                        },
                    ],
                },
            ],
            generationConfig: {
                temperature: 0,
                maxOutputTokens: 256,
                responseMimeType: "application/json",
            },
        };

        const response = await axios.post(GEMINI_API_URL, requestBody, {
            headers: { "Content-Type": "application/json" },
            timeout: 30000,
        });

        const text =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        console.log("Gemini raw response:", text);

        if (!text) {
            return { success: false, msg: "AI không trả về kết quả. Thử lại." };
        }

        let parsed: ScanResult;
        try {
            const cleanText = text.replace(/```json|```/g, "").trim();
            parsed = JSON.parse(cleanText);
        } catch {
            console.log("JSON parse failed, raw text:", text);
            return {
                success: false,
                msg: "Không đọc được kết quả từ AI. Vui lòng chụp ảnh rõ hơn.",
            };
        }

        // Validate dữ liệu trả về
        const result: ScanResult = {
            totalAmount: Number(String(parsed.totalAmount).replace(/[^0-9.]/g, "")) || 0,
            date: parsed.date || new Date().toLocaleDateString("vi-VN"),
            description: parsed.description || "",
            category: parsed.category || "Khác",
        };

        return { success: true, data: result };
    } catch (error: any) {
        const errMsg =
            error?.response?.data?.error?.message ||
            error?.response?.data ||
            error.message;
        console.log("AI scan error:", errMsg);

        if (error?.response?.status === 400) {
            return { success: false, msg: "Ảnh không hợp lệ hoặc quá lớn." };
        }
        if (error?.response?.status === 403) {
            return { success: false, msg: "API key không hợp lệ." };
        }
        if (error?.response?.status === 429) {
            return { success: false, msg: "Đã vượt giới hạn API. Thử lại sau." };
        }
        return {
            success: false,
            msg: `Lỗi: ${errMsg || "Không thể phân tích hóa đơn"}`,
        };
    }
};

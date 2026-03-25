import { GEMINI_API_KEY } from "@/constants";
import { ResponseType, ScanResult } from "@/types";
import axios from "axios";
import { readAsStringAsync } from "expo-file-system/legacy";

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SCAN_PROMPT = `Analyze this receipt/invoice image and extract the following information.
The receipt may be in Vietnamese with diacritics .

Return ONLY a valid JSON object with these exact fields (no markdown, no explanation):
{
  "totalAmount": 0,
  "date": "DD/MM/YYYY HH:mm or DD/MM/YYYY if time not found",
  "description": "danh sách các món/sản phẩm đã mua, cách nhau bằng dấu phẩy, tối đa 5 món, viết bằng tiếng Việt có dấu",
  "category": "chọn 1 trong: Ăn uống, Di chuyển, Mua sắm, Y tế, Giải trí, Giáo dục, Hóa đơn, Khác"
}

Rules:
- totalAmount: số nguyên hoặc thập phân, không có ký hiệu tiền tệ
- date: nếu không tìm thấy thì dùng ngày hôm nay
- description: liệt kê tên các món thực tế trên hóa đơn, viết chuẩn tiếng Việt có dấu
- category: dự đoán dựa trên tên cửa hàng và các món đã mua`;

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
                temperature: 0.1,
                maxOutputTokens: 2048,
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

        // Parse JSON - xử lý cả trường hợp có markdown code block
        const cleanText = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        let parsed: ScanResult;
        try {
            parsed = JSON.parse(cleanText);
        } catch {
            console.log("JSON parse failed, raw text:", cleanText);
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

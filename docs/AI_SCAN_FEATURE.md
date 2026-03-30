# Tính năng AI Scan Invoice

## Tổng quan

Tính năng quét hóa đơn bằng AI cho phép người dùng chụp ảnh hoặc upload ảnh hóa đơn, sử dụng Google Gemini Vision API để tự động trích xuất thông tin và điền vào form tạo giao dịch.

## Kiến trúc

```
Chụp/Upload ảnh (ImagePicker)
        ↓
Giảm kích thước (quality: 0.5, max 1024px)
        ↓
Convert sang Base64 (expo-file-system)
        ↓
Gửi lên Gemini 2.5 Flash API
        ↓
Parse JSON response → ScanResult
        ↓
Hiển thị kết quả (xem / chỉnh sửa)
        ↓
Confirm → tự điền form transactionModal
```

## Các file liên quan

### 1. `services/aiService.ts`
**Chức năng:** Gọi Gemini Vision API và parse kết quả.

| Thành phần | Mô tả |
|-----------|-------|
| `GEMINI_API_URL` | Endpoint Gemini 2.5 Flash (`v1beta`) |
| `SCAN_PROMPT` | Prompt ngắn gọn yêu cầu trích xuất totalAmount, date, description, category |
| `scanInvoiceWithAI(imageUri)` | Hàm chính: đọc ảnh → base64 → gọi API → parse JSON → trả về `ScanResult` |

**Tối ưu tốc độ:**
- `temperature: 0` → không sáng tạo, trả kết quả nhanh nhất
- `maxOutputTokens: 256` → giới hạn output ngắn, tránh bị cắt hoặc quá dài
- `responseMimeType: "application/json"` → Gemini trả JSON thuần, bỏ qua bước parse markdown
- Ảnh giảm xuống quality 0.5, max 1024px → giảm kích thước base64 gửi lên

**Xử lý lỗi:**
| HTTP Status | Thông báo |
|------------|-----------|
| 400 | Ảnh không hợp lệ hoặc quá lớn |
| 403 | API key không hợp lệ |
| 429 | Vượt giới hạn API (free: 15 req/phút, 1500 req/ngày) |
| JSON parse fail | Yêu cầu chụp ảnh rõ hơn |

### 2. `app/(modals)/scanInvoiceModal.tsx`
**Chức năng:** Màn hình quét hóa đơn chính.

**Các state:**
| State | Kiểu | Mô tả |
|-------|------|-------|
| `mode` | `"capture" \| "upload"` | Chế độ chụp camera hoặc upload ảnh |
| `imageUri` | `string \| null` | URI ảnh đã chọn |
| `scanning` | `boolean` | Đang gọi AI |
| `result` | `ScanResult \| null` | Kết quả phân tích |
| `editing` | `boolean` | Đang ở chế độ chỉnh sửa kết quả |

**Các hàm chính:**
| Hàm | Mô tả |
|-----|-------|
| `handleCapture()` | Mở camera, chụp ảnh, lưu URI |
| `handleUpload()` | Mở thư viện ảnh, chọn ảnh, lưu URI |
| `handleScan()` | Gọi `scanInvoiceWithAI()`, hiển thị kết quả |
| `handleConfirm()` | Chuyển sang `transactionModal` với params từ kết quả scan |

**Giao diện:**
- **Tab bar:** CAPTURE MODE / UPLOAD PHOTO (chuyển đổi giữa camera và upload)
- **Khung ảnh:** Hiển thị ảnh đã chọn hoặc placeholder
- **Nút SCAN INVOICE:** Gọi AI phân tích
- **Processing indicator:** Hiển thị "AI Processing..." khi đang xử lý
- **Extraction Results:** 4 trường kết quả (Tổng tiền, Ngày, Danh mục, Mô tả)
- **Footer:** Nút Edit (toggle chỉnh sửa) + Confirm (xác nhận)
- **Màu accent:** Cyan `#00E5FF`

**Component phụ - `EditableField`:**
Inline component cho chế độ chỉnh sửa kết quả. Hiển thị TextInput thay vì text tĩnh khi `editing = true`.

### 3. `components/ScanResultItem.tsx`
**Chức năng:** Component hiển thị 1 dòng kết quả scan.

**Props:**
| Prop | Kiểu | Mô tả |
|------|------|-------|
| `icon` | `ReactNode` | Icon bên trái (phosphor-react-native) |
| `label` | `string` | Tiêu đề nhỏ (vd: "TỔNG TIỀN") |
| `value` | `string` | Giá trị hiển thị (vd: "85.000 VNĐ") |

### 4. `types.ts` - ScanResult type
```typescript
type ScanResult = {
    totalAmount: number;     // 550000000
    date: string;            // "10/06/2016"
    description: string;     // "Bàn ghế máy tính"
    category: string;        // "Mua sắm"
};
```

### 5. `constants/index.ts`
```typescript
export const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";
```
Lấy key tại: https://aistudio.google.com/app/apikey

### 6. `app/_layout.tsx` - Route registration
```typescript
<Stack.Screen
    name="(modals)/scanInvoiceModal"
    options={{ presentation: "modal" }}
/>
```

### 7. `app/(modals)/transactionModal.tsx` - Tích hợp
**Thay đổi:**
- Thêm nút **"AI SCAN RECEIPT"** trong form (trước nút Submit)
- Thêm `mapAICategory()`: chuyển category tiếng Việt → value code (vd: "Ăn uống" → "dining")
- Thêm `parseScannedDate()`: parse "DD/MM/YYYY" → Date object
- `useEffect` xử lý params `scanned=true` từ scanInvoiceModal → tự điền form

**Mapping category AI → App:**
| AI trả về | App value |
|-----------|----------|
| Ăn uống | dining |
| Di chuyển | transportation |
| Mua sắm | groceries |
| Y tế | health |
| Giải trí | entertainment |
| Giáo dục | personal |
| Hóa đơn | utilities |
| Khác | others |

## Dependencies

| Package | Version | Mục đích |
|---------|---------|----------|
| `expo-image-picker` | ~17.0.10 | Chụp ảnh / upload ảnh |
| `expo-file-system` | (bundled) | Đọc file ảnh → base64 |
| `axios` | ^1.13.6 | HTTP request đến Gemini API |

## Luồng sử dụng

1. Người dùng mở **New Transaction** → nhấn **AI SCAN RECEIPT**
2. Chọn **CAPTURE MODE** (chụp camera) hoặc **UPLOAD PHOTO** (chọn từ thư viện)
3. Chụp/chọn ảnh hóa đơn
4. Nhấn **SCAN INVOICE** → AI xử lý 3-8 giây
5. Kết quả hiện ra: Tổng tiền, Ngày, Danh mục, Mô tả
6. (Tùy chọn) Nhấn **Edit** → chỉnh sửa trực tiếp → nhấn **Done**
7. Nhấn **Confirm** → quay lại form giao dịch đã được điền sẵn
8. Chọn Wallet → nhấn **Submit**

## Giới hạn & Lưu ý

- **Free tier Gemini:** 15 requests/phút, 1500 requests/ngày
- **Kích thước ảnh:** Nên < 4MB, app tự giảm xuống quality 0.5 + max 1024px
- **Ngôn ngữ:** Hỗ trợ tiếng Việt (có dấu/không dấu) và tiếng Anh
- **Độ chính xác:** ~90% với hóa đơn rõ ràng, thấp hơn với ảnh mờ/nghiêng
- **API key:** Không commit key thật lên GitHub, dùng placeholder

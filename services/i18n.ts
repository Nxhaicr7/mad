import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "Sign in": "Sign in",
      "Dark Mode": "Dark Mode",
      Language: "Language",
      Notifications: "Notifications",
      "Change Password": "Change Password",
      "Edit Profile": "Edit Profile",
      Settings: "Settings",
      Logout: "Logout",
      "Always take control": "Always take control",
      "of your finances": "of your finances",
      "Finances must be arranged to set a better":
        "Finances must be arranged to set a better",
      "lifestyle in future": "lifestyle in future",
      "Get Started": "Get Started",
      "Update Profile": "Update Profile",
      User: "User",
      Name: "Name",
      Update: "Update",
      Transaction: "Transaction",
      "Are you sure you want to delete this transaction?":
        "Are you sure you want to delete this transaction?",
      Delete: "Delete",
      "Update Transaction": "Update Transaction",
      "New Transaction": "New Transaction",
      Type: "Type",
      Wallet: "Wallet",
      "Select wallet": "Select wallet",
      "Expense Category": "Expense Category",
      "Select category": "Select category",
      Date: "Date",
      Ok: "Ok",
      Amount: "Amount",
      Description: "Description",
      "(optional)": "(optional)",
      Receipt: "Receipt",
      "Upload Image": "Upload Image",
      Submit: "Submit",
      "Total Balance": "Total Balance",
      Income: "Income",
      Expense: "Expense",
      "Please enter a wallet name": "Please enter a wallet name",
      "Are you sure you want to do this? \nThis action will remove all the transactions related to this wallet":
        "Are you sure you want to do this? \nThis action will remove all the transactions related to this wallet",
      "New Wallet": "New Wallet",
      "Wallet Name": "Wallet Name",
      Salary: "Salary",
      "Wallet Icon": "Wallet Icon",
      "Add Wallet": "Add Wallet",
      "Hello,": "Hello,",
      Guest: "Guest",
      "No Transactions added yet!": "No Transactions added yet!",
      "Recent Transactions": "Recent Transactions",
      "Privacy Policy": "Privacy Policy",
      Statistics: "Statistics",

      "My Wallets": "My Wallets",
    }, // Đóng translation của en
  }, // Đóng en

  vi: {
    // Mở vi ngay sau dấu phẩy của en
    translation: {
      "Total Balance": "Tổng số dư",
      Income: "Thu nhập",
      Expense: "Chi tiêu",
      "Sign in": "Đăng nhập",
      "Always take control": "Luôn luôn kiểm soát",
      "of your finances": "tài chính của bạn",
      "Finances must be arranged to set a better":
        "Tài chính cần được sắp xếp để có",
      "lifestyle in future": "tương lai tốt đẹp hơn",
      "Get Started": "Bắt đầu ngay",
      "Update Profile": "Cập nhật hồ sơ",
      "Dark Mode": "Chế độ tối",
      Language: "Ngôn ngữ",
      Notifications: "Thông báo",
      "Change Password": "Đổi mật khẩu",
      "Edit Profile": "Chỉnh sửa hồ sơ",
      Settings: "Cài đặt",
      Logout: "Đăng xuất",
      User: "Người dùng",
      Name: "Tên",
      Update: "Cập nhật",
      Transaction: "Giao dịch",
      "Are you sure you want to delete this transaction?":
        "Bạn có chắc chắn muốn xóa giao dịch này không?",
      Delete: "Xóa",
      "Update Transaction": "Cập nhật giao dịch",
      "New Transaction": "Giao dịch mới",
      Type: "Loại",
      Wallet: "Ví",
      "Select wallet": "Chọn ví",
      "Expense Category": "Danh mục chi tiêu",
      "Select category": "Chọn danh mục",
      Date: "Ngày",
      Ok: "Đồng ý",
      Amount: "Số tiền",
      Description: "Mô tả",
      "(optional)": "(tùy chọn)",
      Receipt: "Hóa đơn",
      "Upload Image": "Tải ảnh lên",
      Submit: "Xác nhận",

      "Please enter a wallet name": "Vui lòng nhập tên ví",
      "Are you sure you want to do this? \nThis action will remove all the transactions related to this wallet":
        "Bạn có chắc chắn muốn làm điều này? \nHành động này sẽ xóa tất cả các giao dịch liên quan đến ví này",
      "New Wallet": "Thêm ví mới",
      "Wallet Name": "Tên ví",
      Salary: "Tiền lương",
      "Wallet Icon": "Biểu tượng ví",
      "Add Wallet": "Thêm ví",
      "Hello,": "Xin chào,",
      Guest: "Khách",
      "No Transactions added yet!": "Chưa có giao dịch nào được thêm!",
      "Recent Transactions": "Giao dịch gần đây",
      "Privacy Policy": "Chính sách bảo mật",
      Statistics: "Thống kê",

      "My Wallets": "Ví của tôi",
    }, // Đóng translation của vi
  }, // Đóng vi
}; // Đóng resources

i18n.use(initReactI18next).init({
  resources,
  lng: "vi",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

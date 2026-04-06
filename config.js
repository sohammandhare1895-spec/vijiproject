// ==================== CONFIGURATION FILE ====================
// Vijji - Worldwide Recipes Manual
// Update this file with your credentials

const CONFIG = {
    // Razorpay Configuration
    RAZORPAY_KEY: "rzp_test_SWKwPioQGrniFF",
    RAZORPAY_SECRET: "GhwMofFReS7BKc0quWF1azJB",
    
    // SheetDB API (for Excel as backend)
    // Step 1: Upload recipes.xlsx to Google Sheets
    // Step 2: Publish to web and get SheetDB API URL
    // Step 3: Replace this URL with your SheetDB endpoint
    SHEETDB_URL: "https://sheetdb.io/api/v1/YOUR_SHEETDB_ID",
    
    // Google Sheets Alternative (Direct)
    GOOGLE_SHEETS_URL: "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv",
    
    // Website Settings
    SITE_NAME: "Vijji",
    SITE_TAGLINE: "Worldwide All in one recipes manual",
    CONTACT_EMAIL: "support@vijji.com",
    
    // Price Mapping based on complexity
    PRICE_MAP: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5
    },
    
    // Language Support
    SUPPORTED_LANGUAGES: [
        { code: "en", name: "English", flag: "🇬🇧" },
        { code: "hi", name: "हिंदी", flag: "🇮🇳" },
        { code: "mr", name: "मराठी", flag: "🇮🇳" },
        { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
        { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
        { code: "fr", name: "Français", flag: "🇫🇷" },
        { code: "de", name: "Deutsch", flag: "🇩🇪" },
        { code: "zh", name: "中文", flag: "🇨🇳" },
        { code: "ja", name: "日本語", flag: "🇯🇵" },
        { code: "ko", name: "한국어", flag: "🇰🇷" },
        { code: "pt", name: "Português", flag: "🇧🇷" }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
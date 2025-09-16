// netlify/functions/check-code.js
exports.handler = async function (event, context) {
  // מקורות שמותר להם לגשת (עדכן לרשימה שלך)
  const ALLOWED_ORIGINS = new Set([
    "https://cocan4.github.io",          // GitHub Pages שלך
    "https://YOUR-SITE.netlify.app",     // אתר ה-Netlify שלך (עדכן!)
    "http://localhost:5173",             // דוגמה ל-Vite dev
    "http://127.0.0.1:5500",             // דוגמה ל-Live Server
    "http://localhost:8080",             // דוגמה לשרת מקומי
    "null"                               // כשפותחים קובץ ישירות (file://) – origin הוא 'null'
  ]);

  const reqOrigin = event.headers.origin || "null";
  const allowThis = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : "https://cocan4.github.io";

  const commonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowThis,
    "Vary": "Origin"
  };

  // Preflight (דפדפן בודק לפני POST אמיתי)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        ...commonHeaders,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: commonHeaders,
      body: JSON.stringify({ ok: false, message: "Method Not Allowed" })
    };
  }

  try {
    const body

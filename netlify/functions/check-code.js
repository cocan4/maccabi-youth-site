// netlify/functions/check-code.js
exports.handler = async function (event, context) {
  // מותר לגשת מהדומיינים האלה:
  const ALLOWED_ORIGINS = new Set([
    "https://cocan4.github.io",          // GitHub Pages שלך
    "https://maccabi-rg.netlify.app",    // אתר ה-Netlify שלך
    "http://localhost:8080",             // פיתוח מקומי (עדכן/הסר אם לא צריך)
    "null"                                // פתיחה כקובץ מקומי (file://) – אופציונלי
  ]);

  const reqOrigin = event.headers.origin || "null";
  const allowThis = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : "https://cocan4.github.io";
  const common = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowThis,
    "Vary": "Origin"
  };

  // Preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        ...common,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: common, body: JSON.stringify({ ok:false, message:"Method Not Allowed" }) };
  }

  try {
    const { code } = JSON.parse(event.body || "{}");
    const SECRET = process.env.GATE_CODE || "";
    if (!code) {
      return { statusCode: 400, headers: common, body: JSON.stringify({ ok:false, message:"אין קוד" }) };
    }
    const ok = !!SECRET && code.toString().trim() === SECRET;
    return { statusCode: ok ? 200 : 401, headers: common, body: JSON.stringify({ ok, message: ok ? "OK" : "קוד לא תקני" }) };
  } catch {
    return { statusCode: 500, headers: common, body: JSON.stringify({ ok:false, message:"שגיאה פנימית" }) };
  }
};

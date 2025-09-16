// netlify/functions/check-code.js
exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, message: 'Method Not Allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const code = (body.code || '').toString().trim();

    // Set GATE_CODE as Environment Variable in Netlify UI (Settings → Build & deploy → Environment)
    const SECRET = process.env.GATE_CODE || '';

    if (!code) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, message: 'אין קוד' })
      };
    }

    if (SECRET && code === SECRET) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: true, message: 'OK' })
      };
    } else {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, message: 'קוד לא תקני' })
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, message: 'שגיאה פנימית' })
    };
  }
};


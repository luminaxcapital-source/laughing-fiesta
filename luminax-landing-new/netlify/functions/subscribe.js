const { google } = require("googleapis");
const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let email = "";
  try {
    const body = JSON.parse(event.body || "{}");
    email = String(body.email || "").trim().toLowerCase();
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid email address" }) };
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:B",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[email, new Date().toISOString()]] },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"LuminaX" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "You're on the LuminaX waitlist",
      html: `
        <div style="font-family: -apple-system, sans-serif; background:#000; color:#fff; padding:40px 32px; max-width:480px; margin:0 auto;">
          <h1 style="margin:0 0 16px; font-size:22px;">Welcome to LuminaX</h1>
          <p style="margin:0 0 12px; color:#ccc; line-height:1.6;">
            Thanks for joining the waitlist. We'll email you as soon as LuminaX is ready for you.
          </p>
          <p style="margin:24px 0 0; color:#666; font-size:12px;">No spam — just your invite.</p>
        </div>
      `,
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("subscribe function error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Something went wrong, please try again" }) };
  }
};

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

   const testEmails = ["text@mail.com", "marty16600@gmail.com";"francy.saxon@gmail.com"];
if (!testEmails.includes(email)) {
      const existing = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "A:A",
      });
      const rows = existing.data.values || [];
      const alreadySubscribed = rows.some((row) => (row[0] || "").trim().toLowerCase() === email);
      if (alreadySubscribed) {
        return { statusCode: 409, body: JSON.stringify({ error: "duplicate" }) };
      }
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "A:B",
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

    const logoUrl = "https://luminaxcapital.com/logo.png";

    await transporter.sendMail({
      from: `"LuminaX" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "You're on the LuminaX waitlist",
      html: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
        <tr>
          <td align="center" style="background:#000000; padding:28px 16px;">
            <img src="${logoUrl}" alt="LuminaX" width="190" style="display:block; height:auto; width:190px;" />
          </td>
        </tr>
        <tr>
          <td align="center" style="background:#ffffff; padding:40px 16px;">
            <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%; font-family:-apple-system,Helvetica,Arial,sans-serif;">
              <tr>
                <td align="center" style="padding-bottom:16px;">
                  <h1 style="margin:0; color:#000000; font-size:22px; font-weight:700;">You're in!</h1>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom:24px;">
                  <p style="margin:0; color:#333333; font-size:14px; line-height:1.6;">
                    Welcome to LuminaX.<br />
                    We'll email you as soon as LuminaX is ready for you.
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" style="border-top:1px solid #e5e5e5; padding-top:20px;">
                  <p style="margin:0; color:#888888; font-size:12px;">No spam — just your invite.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      `,
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("subscribe function error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Something went wrong, please try again" }) };
  }
};

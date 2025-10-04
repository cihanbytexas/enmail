import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER; // Gmail kullanıcı
const EMAIL_PASS = process.env.EMAIL_PASS; // Gmail App Password

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, user_id, avatar_url, message, priority = "Normal", server_invite = "#" } = req.body;

  const colors = { "Acil": "#ff4c4c", "Önemli": "#ffb84d", "Normal": "#4caf50" };
  const color = colors[priority] || "#4caf50";
  const profile_url = `https://discord.com/users/${user_id}`;

  const html = `
    <html>
      <body style="font-family:'Segoe UI',sans-serif;background:#f5f6fa;padding:30px;">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:14px;
                    box-shadow:0 6px 20px rgba(0,0,0,0.1);overflow:hidden;">
          
          <!-- Header -->
          <div style="background:${color};padding:20px;text-align:center;color:white;">
            <h2 style="margin:0;">Enforce Geri Bildirim Sistemi</h2>
            <p style="margin:4px 0;font-size:13px;">${new Date().toLocaleString()}</p>
          </div>

          <div style="padding:25px;text-align:center;">
            <img src="${avatar_url}" alt="Avatar" width="90" height="90"
                 style="border-radius:50%;object-fit:cover;box-shadow:0 0 8px rgba(0,0,0,0.2);">
            <h3 style="margin:10px 0 0 0;">${username}</h3>
            <p style="color:#888;font-size:13px;">ID: ${user_id}</p>

            <div style="background:#fafafa;border-left:5px solid ${color};
                        margin:20px auto;padding:15px;text-align:left;
                        border-radius:8px;max-width:90%;">
              <p style="margin:0;font-size:15px;line-height:1.5;">${message}</p>
            </div>

            <!-- Butonlar -->
            <table align="center" style="margin:20px auto;">
              <tr>
                <td style="padding:5px;">
                  <a href="${profile_url}" style="background:${color};color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;display:inline-block;">Discord Profilini Gör</a>
                </td>
                <td style="padding:5px;">
                  <a href="${server_invite}" style="background:#555;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;display:inline-block;">Sunucuya Git</a>
                </td>
              </tr>
            </table>
          </div>

          <div style="background:#f1f1f1;padding:10px;text-align:center;font-size:12px;color:#777;">
            📩 Bu mail Enforce sistemi tarafından otomatik gönderilmiştir.<br>
            Developer: TEXASTR
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `Enforce Geri Bildirim <${EMAIL_USER}>`,
      to: EMAIL_USER,
      subject: `[${priority}] Yeni Geri Bildirim: ${username}`,
      html
    });

    res.status(200).json({ success: true, message: "E-posta gönderildi." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.toString() });
  }
}

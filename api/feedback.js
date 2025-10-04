import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Only POST allowed");

  const { user, message, attachment } = req.body; // attachment opsiyonel

  if (!user || !message) 
    return res.status(400).json({ error: "user veya message eksik" });

  try {
    // ---------- E-POSTA ----------
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"BDFD Bot" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Yeni Geri Bildirim: ${user}`,
      text: message + (attachment ? `\nAttachment: ${attachment}` : ""),
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
